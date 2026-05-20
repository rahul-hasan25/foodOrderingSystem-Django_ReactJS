from django.urls import path, include
from .views import *
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'foods', FoodViewSet, basename='food')

urlpatterns = [
    path('admin/login/', admin_login_view, name='foodflex_admin_login_api'),
    
    path('add-category/', add_category),
    path('categories/', list_categories),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),
    
    path('categories-list/', CategoryListAPIView.as_view(), name='api-category-list'), # Category dropdown
    path('foods_add/', FoodCreateAPIView.as_view(), name='api-food-add'),
    path('food_manage/', FoodListDestroyAPIView.as_view(), name='api-food-list'),
    path('food_manage/<int:pk>/', FoodDetailAPIView.as_view(), name='api-food-detail'),
    
    path('search/', views.search_food, name='search_food'),
    
    path('homepage-menu/', views.get_homepage_featured_menu, name='homepage_menu'),
    
    path('user/register/', register_customer),
    path('login/', views.login_user, name='login_user'),
    
    path('', include(router.urls)), # Food Details Page API
    
    path('cart/add/', views.add_to_cart_view, name='add_to_cart'), # Add to Cart Link
    
    path('cart/', views.manage_cart, name='manage_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_quantity, name='update_cart_quantity'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    
    path('cart/count/', views.get_cart_count, name='get_cart_count'),  # Cart Icon Count
]