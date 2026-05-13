from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'first_name',
        'last_name',
        'email',
        'mobile',
        'reg_date',
    )
    search_fields = (
        'first_name',
        'last_name',
        'email',
        'mobile',
    )
    list_filter = ('reg_date',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'category_name',
        'creation_date',
    )
    search_fields = ('category_name',)
    list_filter = ('creation_date',)


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'item_name',
        'category',
        'item_price',
        'item_quantity',
        'is_available',
    )
    search_fields = (
        'item_name',
        'category__category_name',
    )
    list_filter = (
        'category',
        'is_available',
    )