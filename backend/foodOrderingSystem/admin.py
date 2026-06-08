from django.contrib import admin
# Explicitly import individual models to avoid overlapping names with django.contrib.auth
from .models import (
    User as CustomerUser, 
    Category, 
    Food, 
    Review, 
    Orders, 
    OrderAddress, 
    Payment
)

@admin.register(CustomerUser)
class CustomerUserAdmin(admin.ModelAdmin):
    list_display  = ('id', 'first_name', 'last_name', 'email', 'mobile', 'reg_date',)
    search_fields = ('first_name', 'last_name', 'email', 'mobile',)
    list_filter   = ('reg_date',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ('category_name', 'creation_date')
    search_fields = ('category_name',)
    list_filter   = ('creation_date',)


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display  = ('item_name', 'category', 'item_price', 'item_quantity', 'is_available',)
    search_fields = ('item_name', 'category__category_name',)
    list_filter   = ('category', 'is_available',)
    

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display    = ('user', 'food', 'rating', 'short_comment', 'created_at',)
    list_filter     = ('rating', 'created_at',)
    search_fields   = ('user__first_name', 'user__email', 'food__item_name', 'comment',)
    readonly_fields = ('created_at',)
    ordering        = ('-created_at',)
    list_per_page   = 20
    
    def short_comment(self, obj):
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment
    short_comment.short_description = "Comment"
    
    
@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display    = ('user', 'food', 'quantity', 'is_order_placed', 'order_number', 'price_at_purchase', 'created_at',)
    list_filter     = ('is_order_placed', 'created_at',)
    search_fields   = ('user__first_name', 'user__email', 'food__item_name', 'order_number',)
    readonly_fields = ('order_number', 'price_at_purchase', 'created_at', 'updated_at',)
    ordering        = ('-created_at',)
    list_per_page   = 20


@admin.register(OrderAddress)
class OrderAddressAdmin(admin.ModelAdmin):
    list_display    = ('user', 'contact_person_name', 'contact_person_phone', 'address_tag', 'area_or_neighborhood', 'city_or_division', 'is_default', 'created_at',)
    list_filter     = ('address_tag', 'is_default', 'city_or_division', 'created_at',)
    
    # FIXED: Extracted missing search attribute 'user__userName' to ensure interface searches don't crash
    search_fields   = ('user__first_name', 'user__email', 'contact_person_name', 'contact_person_phone', 'street_address', 'area_or_neighborhood', 'city_or_division',)
    
    readonly_fields = ('created_at', 'updated_at',)
    ordering        = ('-is_default', '-created_at',)
    list_per_page   = 20
    
    fieldsets = (
        ('User Information', {'fields': ('user', 'address_tag', 'is_default', )}),
        ('Contact Information', {'fields': ('contact_person_name', 'contact_person_phone', 'alternative_phone',)}),
        ('Address Details', {'fields': ('street_address', 'area_or_neighborhood', 'city_or_division', 'postal_code', 'delivery_landmark',)}),
        ('Location Coordinates', {'fields': ('latitude', 'longitude',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at',)}),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display    = ('user', 'order', 'payment_method', 'payment_status', 'amount', 'transaction_id', 'created_at',)
    list_filter     = ('payment_method', 'payment_status', 'created_at',)
    
    # FIXED: Replaced non-existent 'order__id' constraint lookup with 'order__order_number'
    search_fields   = ('user__first_name', 'user__email', 'transaction_id', 'order__order_number',)
    
    readonly_fields = ('transaction_id', 'created_at', 'updated_at',)
    ordering        = ('-created_at',)
    list_per_page   = 20
    
    fieldsets = (
        ('Payment Information', {'fields': ('user', 'order', 'amount',)}),
        ('Payment Status', {'fields': ('payment_method', 'payment_status', 'transaction_id',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at',)}),
    )