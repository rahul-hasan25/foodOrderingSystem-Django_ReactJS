from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Avg
from django.db.models import Sum


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'category_name', 'creation_date']
        

class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)

    class Meta:
        model  = Food
        fields = ['id', 'category', 'category_name', 'item_name', 'item_price', 'item_description', 'image', 'item_quantity', 'is_available']
        
        

class UserRegisterSerializer(serializers.ModelSerializer):
    password        = serializers.CharField(write_only=True, min_length=6)
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['id','first_name','last_name','email','mobile','password','repeat_password','reg_date']
        read_only_fields = ['reg_date']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['repeat_password']:
            raise serializers.ValidationError({"repeat_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('repeat_password')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

class FoodDetailSerializer(serializers.ModelSerializer):
    category_name  = serializers.CharField(source='category.category_name', read_only=True)
    reviews        = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count   = serializers.SerializerMethodField()
    tags_list      = serializers.SerializerMethodField()

    class Meta:
        model  = Food
        fields = [
            'id', 'category', 'category_name', 'item_name', 'item_price', 'discount_price',
            'item_description', 'image', 'item_quantity', 'is_available', 'shipping_charge',
            'preparation_time', 'calories', 'tags_list', 'average_rating', 'review_count', 'reviews'
        ]

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_tags_list(self, obj):
        return [tag.strip() for tag in obj.dietary_tags.split(',')] if obj.dietary_tags else []
    
    

class OrderSerializer(serializers.ModelSerializer):
    food_name   = serializers.ReadOnlyField(source='food.item_name')
    total_price = serializers.ReadOnlyField() 

    class Meta:
        model  = Orders
        fields = ['id', 'user', 'food', 'food_name', 'quantity', 'is_order_placed', 'order_number', 'total_price', 'created_at']
        


class CartFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Food
        fields = ['id', 'item_name', 'item_price', 'discount_price', 'image', 'item_quantity', 'shipping_charge']

class CartItemSerializer(serializers.ModelSerializer):
    food        = CartFoodSerializer(read_only=True)
    total_price = serializers.ReadOnlyField() 

    class Meta:
        model  = Orders
        fields = ['id', 'food', 'quantity', 'total_price', 'created_at']
        



class OrderAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model  = OrderAddress
        fields = ['id', 'user', 'contact_person_name', 'contact_person_phone','alternative_phone', 'street_address', 'area_or_neighborhood','city_or_division', 'postal_code', 'delivery_landmark', 'latitude', 'longitude', 'address_tag', 'is_default']

class CheckoutFinalizeSerializer(serializers.Serializer):
    address_id     = serializers.IntegerField(required=True)
    payment_method = serializers.ChoiceField(choices=['COD', 'CARD', 'BKASH'], required=True)
    card_number    = serializers.CharField(required=False, allow_blank=True)
    bkash_number   = serializers.CharField(required=False, allow_blank=True)
    


#Add this new two
class CheckoutFoodSerializer(serializers.ModelSerializer):
    """Provides complete nested structural details of the food item to the checkout."""
    class Meta:
        model  = Food
        fields = ['id', 'item_name', 'item_price', 'item_quantity', 'discount_price', 'shipping_charge', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    """Serializes the unplaced active cart Orders along with nested food records."""
    food = CheckoutFoodSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Orders
        fields = ['id', 'user', 'food', 'quantity', 'is_order_placed', 'order_number', 'price_at_purchase', 'total_price']
        
        



# My Order Page
class OrderFoodDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Food
        fields = ['id', 'item_name', 'image', 'dietary_tags', 'shipping_charge']

class OrderPaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['payment_method', 'payment_status', 'transaction_id']

class MyOrdersGroupSerializer(serializers.ModelSerializer):
    food           = OrderFoodDetailsSerializer(read_only=True)
    payment        = OrderPaymentStatusSerializer(read_only=True)
    total_price    = serializers.ReadOnlyField()
    date_formatted = serializers.SerializerMethodField()

    class Meta:
        model  = Orders
        fields = ['id', 'order_number', 'food', 'quantity', 'price_at_purchase', 'total_price', 'created_at', 'date_formatted', 'payment']

    def get_date_formatted(self, obj):
        return obj.created_at.strftime("%b %d, %Y %I:%M %p")
    
    
    

# My Profile 
class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model            = OrderAddress
        fields           = '__all__'
        read_only_fields = ['user']

class UserProfileSerializer(serializers.ModelSerializer):
    total_orders_placed   = serializers.SerializerMethodField()
    total_amount_spent    = serializers.SerializerMethodField()
    reviews_written_count = serializers.SerializerMethodField()
    delivery_addresses    = OrderAddressSerializer(many=True, read_only=True)

    class Meta:
        model            = User
        fields           = ['id', 'first_name', 'last_name', 'email', 'mobile', 'reg_date', 'total_orders_placed', 'total_amount_spent', 'reviews_written_count', 'delivery_addresses']
        read_only_fields = ['id', 'email', 'reg_date']

    def get_total_orders_placed(self, obj):
        return Orders.objects.filter(user=obj, is_order_placed=True).values('order_number').distinct().count()

    def get_total_amount_spent(self, obj):
        placed_orders = Orders.objects.filter(user=obj, is_order_placed=True)
        total         = sum(order.total_price for order in placed_orders if order.total_price)
        return float(total)

    def get_reviews_written_count(self, obj):
        return Review.objects.filter(user=obj).count()
    
    
    


# User Setting
class SettingsAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model            = OrderAddress
        fields           = '__all__'
        read_only_fields = ['user']

class SettingsUserSerializer(serializers.ModelSerializer):
    profile_completion_percentage = serializers.SerializerMethodField()
    has_saved_addresses           = serializers.SerializerMethodField()
    has_payment_history           = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'first_name', 'last_name', 'email', 'mobile', 'reg_date', 'profile_completion_percentage', 'has_saved_addresses', 'has_payment_history']
        read_only_fields = ['id', 'email', 'reg_date']

    def get_profile_completion_percentage(self, obj):
        steps    = [obj.first_name, obj.last_name, obj.email, obj.mobile]
        filled   = len([step for step in steps if step])
        has_addr = OrderAddress.objects.filter(user=obj).exists()
        if has_addr:
            filled += 1
        return int((filled / 5) * 100)

    def get_has_saved_addresses(self, obj):
        return OrderAddress.objects.filter(user=obj).exists()

    def get_has_payment_history(self, obj):
        return Payment.objects.filter(user=obj).exists()


class PasswordUpdateSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password     = serializers.CharField(required=True, write_only=True, min_length=6)

    def validate_current_password(self, value):
        user = self.context['request_user']
        if user.password != value and not check_password(value, user.password):
            raise serializers.ValidationError("Your original authentication credentials do not match our database.")
        return value
    
    
    
    
# Admin Orders ---> All Orders
class AdminUserSummarySerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'full_name', 'email', 'mobile']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class AdminFoodSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Food
        fields = ['id', 'item_name', 'item_price', 'discount_price', 'image']

class AdminPaymentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['payment_method', 'payment_status', 'amount', 'transaction_id']

class AdminOrderDetailsSerializer(serializers.ModelSerializer):
    user_details   = AdminUserSummarySerializer(source='user', read_only=True)
    food_details   = AdminFoodSummarySerializer(source='food', read_only=True)
    payment_info   = serializers.SerializerMethodField()
    computed_total = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model  = Orders
        fields = ['id', 'order_number', 'user_details', 'food_details', 'quantity', 'price_at_purchase', 'computed_total', 'is_order_placed', 'created_at', 'updated_at', 'payment_info']

    def get_payment_info(self, obj):
        payment = Payment.objects.filter(order=obj).first()
        if payment:
            return AdminPaymentSummarySerializer(payment).data
        return None
    
    
    
# Admin ---> Between Date Reports
class OrderReportSerializer(serializers.ModelSerializer):
    customer_name          = serializers.SerializerMethodField()
    food_name              = serializers.CharField(source='food.item_name', read_only=True)
    total_amount           = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)
    payment_status         = serializers.SerializerMethodField()
    payment_method_display = serializers.SerializerMethodField()

    class Meta:
        model  = Orders
        fields = ['id', 'order_number', 'customer_name', 'food_name', 'quantity', 'total_amount', 'payment_status', 'payment_method_display', 'created_at']

    def get_customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_payment_status(self, obj):
        payment = obj.payments.first()
        return payment.payment_status if payment else "Pending"

    def get_payment_method_display(self, obj):
        payment = obj.payments.first()
        return payment.get_payment_method_display() if payment else "Not Selected"
    
    
    
# Admin ---> Order Serach Page
class OrderSearchListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='food.item_name', read_only=True)
    total_amount = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Orders
        fields = [
            'id', 'order_number', 'customer_name', 'product_name', 
            'quantity', 'total_amount', 'payment_status', 'created_at'
        ]

    def get_customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_payment_status(self, obj):
        payment = obj.payments.first()
        return payment.payment_status if payment else "Pending"


class OrderDetailModalSerializer(serializers.ModelSerializer):
    customer_name    = serializers.SerializerMethodField()
    customer_email   = serializers.CharField(source='user.email', read_only=True)
    customer_mobile  = serializers.CharField(source='user.mobile', read_only=True)
    product_name     = serializers.CharField(source='food.item_name', read_only=True)
    product_image    = serializers.ImageField(source='food.image', read_only=True)
    base_unit_price  = serializers.SerializerMethodField()
    shipping_charge  = serializers.DecimalField(source='food.shipping_charge', max_digits=5, decimal_places=2, read_only=True)
    total_amount     = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)
    payment_info     = serializers.SerializerMethodField()
    shipping_address = serializers.SerializerMethodField()

    class Meta:
        model  = Orders
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 'customer_mobile',
            'product_name', 'product_image', 'quantity', 'base_unit_price',
            'shipping_charge', 'total_amount', 'payment_info', 'shipping_address', 'created_at'
        ]

    def get_customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_base_unit_price(self, obj):
        if obj.price_at_purchase:
            return obj.price_at_purchase
        return obj.food.discount_price if obj.food.discount_price else obj.food.item_price

    def get_payment_info(self, obj):
        payment = obj.payments.first()
        if payment:
            return {
                'method': payment.get_payment_method_display(),
                'status': payment.payment_status,
                'transaction_id': payment.transaction_id or 'N/A'
            }
        return {'method': 'Not Chosen', 'status': 'Pending', 'transaction_id': 'N/A'}

    def get_shipping_address(self, obj):
        address = OrderAddress.objects.filter(user=obj.user, is_default=True).first() or OrderAddress.objects.filter(user=obj.user).first()
        if address:
            return {
                'contact_name': address.contact_person_name,
                'contact_phone': address.contact_person_phone,
                'street': address.street_address,
                'area': address.area_or_neighborhood,
                'city': address.city_or_division,
                'landmark': address.delivery_landmark or 'None stated'
            }
        return None
    
    
#ADMIN -----> User Registered Page
class AdminUserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderAddress
        fields = ['id', 'address_tag', 'contact_person_name', 'contact_person_phone', 'street_address', 'area_or_neighborhood', 'city_or_division', 'is_default']

class AdminUserDetailSerializer(serializers.ModelSerializer):
    total_orders_count = serializers.SerializerMethodField()
    total_spent        = serializers.SerializerMethodField()
    saved_addresses    = AdminUserAddressSerializer(many=True, source='delivery_addresses', read_only=True)

    class Meta:
        model  = User
        fields = ['id', 'first_name', 'last_name', 'email', 'mobile', 'reg_date', 'total_orders_count', 'total_spent', 'saved_addresses']

    def get_total_orders_count(self, obj):
        return obj.user_orders.filter(is_order_placed=True).count()

    def get_total_spent(self, obj):
        payments = obj.payments.filter(payment_status='Completed')
        return sum(payment.amount for payment in payments)