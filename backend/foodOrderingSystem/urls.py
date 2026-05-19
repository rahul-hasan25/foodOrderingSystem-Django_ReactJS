from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('admin-login/', admin_login_api),
    path('add-category/', add_category),
    path('categories/', list_categories),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),
    path('categories-list/', CategoryListAPIView.as_view(), name='api-category-list'),
    path('foods/add/', FoodCreateAPIView.as_view(), name='api-food-add'),
    path('foods/', FoodListDestroyAPIView.as_view(), name='api-food-list'),
    path('foods/<int:pk>/', FoodDetailAPIView.as_view(), name='api-food-detail'),
    path('search/', views.search_food, name='search_food'),
]