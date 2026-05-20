from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User as AdminUser
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import action
from decimal import Decimal
from django.db.models import Sum



#<--------ADMIN-------->
#Login Page
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_view(request):
    username_input = request.data.get('username')
    password_input = request.data.get('password')
    
    if not username_input or not password_input:
        return Response(
            {
                'success': False,
                'message': 'FoodFlex admin credentials are incomplete.'
            }, status=status.HTTP_400_BAD_REQUEST
        )
        
    try:
        try:
            admin_user = AdminUser.objects.get(username=username_input)
        except AdminUser.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid administrative user credentials.'
                }, status=status.HTTP_401_UNAUTHORIZED
            )
        if admin_user.check_password(password_input):
            if admin_user.is_staff or admin_user.is_superuser:
                return Response(
                    {
                        'success': True,
                        'message': f'Welcome back to Central Kitchen Operations, {admin_user.username}!',
                        'username': admin_user.username
                    }, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        'success': False,
                        'message': 'Access Denied: Account lacks administrative system flags.'
                    }, status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid administrative user credentials.'
                }, status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {
                'success': False,
                'message': f"Internal Server Authentication Error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        
        

# Product Detail
class FoodViewSet(viewsets.ModelViewSet):
    queryset         = Food.objects.all()
    serializer_class = FoodDetailSerializer

    @action(detail=True, methods=['get', 'post', 'put', 'patch', 'delete', 'head', 'options'], url_path='add-review')
    def add_review(self, request, pk=None):
        food_item = self.get_object()
        user_id   = request.data.get('user_id')
        rating    = request.data.get('rating')
        comment   = request.data.get('comment')

        if not user_id or not rating or not comment:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User session invalid or not found."}, status=status.HTTP_404_NOT_FOUND)

        review = Review.objects.create(
            food   = food_item,
            user   = user,
            rating = int(rating),
            comment= comment
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    
    
    
# Add to Cart Link    
@api_view(['POST'])
def add_to_cart_view(request):
    user_id  = request.headers.get('X-User-Id') or request.data.get('user_id')
    food_id  = request.data.get('food_id')
    quantity = int(request.data.get('quantity', 1))

    if not user_id:
        return Response({'success': False, 'message': 'Authentication required. Missing user key.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_obj = get_object_or_404(User, id=user_id)
    food_obj = get_object_or_404(Food, id=food_id)

    if not food_obj.is_available:
        return Response({'success': False, 'message': 'This premium item is currently out of stock.'}, status=status.HTTP_400_BAD_REQUEST)

    # Professional Upsert Pattern: Combine matching open selections to keep records tidy
    cart_item, created = Orders.objects.get_or_create(
        user=user_obj,
        food=food_obj,
        is_order_placed=False, # Focus exclusively on uncompleted line items
        defaults={'quantity': quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({
        'success': True,
        'message': f'"{food_obj.item_name}" has been placed in your dining collection container.'
    }, status=status.HTTP_200_OK)
    
    
    

# Manage Cart
@api_view(['GET', 'POST'])
def manage_cart(request):
    user_id = request.headers.get('X-User-Id') or request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Authentication tracking token missing.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_obj = get_object_or_404(User, id=user_id)

    if request.method == 'GET':
        cart_items       = Orders.objects.filter(user=user_obj, is_order_placed=False).order_by('-created_at')
        serializer       = CartItemSerializer(cart_items, many=True)
        subtotal         = Decimal('0.00')
        highest_shipping = Decimal('0.00')
        
        for item in cart_items:
            price = item.food.discount_price if item.food.discount_price else item.food.item_price
            subtotal += price * item.quantity
            
            if item.food.shipping_charge > highest_shipping:
                highest_shipping = item.food.shipping_charge
        
        shipping_fee = Decimal('0.00') if subtotal >= Decimal('500.00') or subtotal == 0 else highest_shipping
        grand_total  = subtotal + shipping_fee

        return Response({
            'items'  : serializer.data,
            'summary': {
                'subtotal': float(subtotal),
                'shipping_fee': float(shipping_fee),
                'free_delivery_threshold': 500.00,
                'grand_total': float(grand_total)
            }
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
def update_cart_quantity(request, item_id):
    user_id   = request.headers.get('X-User-Id')
    cart_item = get_object_or_404(Orders, id=item_id, user_id=user_id, is_order_placed=False)
    action    = request.data.get('action') # 'increase' or 'decrease'
    
    if action == 'increase':
        cart_item.quantity += 1
    elif action == 'decrease' and cart_item.quantity > 1:
        cart_item.quantity -= 1
    else:
        return Response({'error': 'Invalid operational bounds request.'}, status=status.HTTP_400_BAD_REQUEST)
        
    cart_item.save()
    return Response({'success': True, 'message': 'Quantity updated.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    user_id   = request.headers.get('X-User-Id')
    cart_item = get_object_or_404(Orders, id=item_id, user_id=user_id, is_order_placed=False)
    cart_item.delete()
    return Response({'success': True, 'message': 'Dishes extracted from your order collection.'}, status=status.HTTP_200_OK)



# Cart icon item count
@api_view(['GET'])
def get_cart_count(request):
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        return Response({'cart_count': 0}, status=status.HTTP_200_OK)
    user_obj = get_object_or_404(User, id=user_id)

    cart_aggregation = Orders.objects.filter(
        user=user_obj, 
        is_order_placed=False
    ).aggregate(total_items=Sum('quantity'))
    
    count = cart_aggregation.get('total_items') or 0
    
    return Response({'cart_count': count}, status=status.HTTP_200_OK)