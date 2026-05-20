from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display  = ('first_name','last_name','email','mobile','reg_date',)
    search_fields = ('first_name','last_name', 'email','mobile',)
    list_filter   = ('reg_date',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ('category_name','creation_date')
    search_fields = ('category_name',)
    list_filter   = ('creation_date',)


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display  = ('item_name','category','item_price','item_quantity','is_available',)
    search_fields = ('item_name','category__category_name',)
    list_filter   = ('category','is_available',)
    

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display    = ('user','food','rating','short_comment','created_at',)
    list_filter     = ('rating','created_at',)
    search_fields   = ('user__first_name','user__email','food__item_name','comment',)
    readonly_fields = ('created_at',)
    ordering        = ('-created_at',)
    list_per_page   = 20
    def short_comment(self, obj):
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment
    short_comment.short_description = "Comment"
    
    
@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display    = ('user','food', 'quantity','is_order_placed','order_number','price_at_purchase','created_at',)
    list_filter     = ('is_order_placed','created_at',)
    search_fields   = ('user__first_name','user__email','food__item_name','order_number',)
    readonly_fields = ('order_number','price_at_purchase','created_at','updated_at',)
    ordering        = ('-created_at',)
    list_per_page   = 20