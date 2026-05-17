from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *


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