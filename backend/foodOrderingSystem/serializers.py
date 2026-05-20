from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.db.models import Avg


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