from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password


#<--------ADMIN-------->
#Login Page
@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        return Response(
            {
                'success'  : True,
                'message'  : 'Login Successful!',
                'username' : username
            }, status=status.HTTP_200_OK
        )
    return Response(
        {
            'success' : False,
            'message' : 'Invalid Credentials!'
        }, status=status.HTTP_401_UNAUTHORIZED
    )
    
#ADMIN Sidebar
#Add Category
@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')
    Category.objects.create(category_name=category_name)
    return Response(
        {
            'success' : True,
            'message' : 'Category has been created!'
        }, status=status.HTTP_201_CREATED
    )


#Manage Category
@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


class CategoryDetailAPIView(APIView):
    def put(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return Response(
            {"message": "Category deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )
        
        

# Add Food
class CategoryListAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FoodCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


#Manage FOOD
class FoodListDestroyAPIView(APIView):
    def get(self, request):
        foods = Food.objects.all().select_related('category')
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FoodDetailAPIView(APIView):
    def put(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        food.delete()
        return Response({"message": "Food item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



# Search Page 
@api_view(['GET'])
def search_food(request):
    query = request.GET.get('q', '')
    
    if query:
        foods = Food.objects.filter(
            Q(item_name__icontains=query) | 
            Q(item_description__icontains=query)
        )
    else:
        foods = Food.objects.all()
        
    serializer = FoodSerializer(foods, many=True, context={'request': request})
    return Response(serializer.data)


# Home Page Food Item
@api_view(['GET'])
def get_homepage_featured_menu(request):
    featured_foods = Food.objects.filter(is_available=True).order_by('?')[:8]
    
    serializer = FoodSerializer(featured_foods, many=True, context={'request': request})
    return Response(serializer.data)



# User Registration
@api_view(['POST'])
def register_customer(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "message": "Welcome aboard! Your account has been created successfully."
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
    


# User Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    identity = request.data.get('identity')
    password = request.data.get('password')

    if not identity or not password:
        return Response({
            "success": False,
            "message": "Please provide both identity and password."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        if '@' in identity:
            user = User.objects.get(email=identity)
        else:
            user = User.objects.get(mobile=identity)

        if check_password(password, user.password):
            return Response({
                "success": True,
                "message": f"Welcome back, {user.first_name}!",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "mobile": user.mobile
                }
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Invalid password."
        }, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({
            "success": False,
            "message": "User not found."
        }, status=status.HTTP_404_NOT_FOUND)