from django.urls import path
from .views import *
from .views import CategoryDetailAPIView

urlpatterns = [
    path('admin-login/', admin_login_api),
    path('add-category/', add_category),
    path('categories/', list_categories),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),
]