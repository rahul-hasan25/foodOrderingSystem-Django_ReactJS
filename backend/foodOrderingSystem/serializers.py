from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'category_name', 'creation_date']
        

class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'category', 'category_name', 'item_name', 'item_price', 'item_description', 'image', 'item_quantity', 'is_available']
        
        

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'mobile',
            'password',
            'repeat_password',
            'reg_date'
        ]
        read_only_fields = ['reg_date']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['repeat_password']:
            raise serializers.ValidationError({
                "repeat_password": "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('repeat_password')

        validated_data['password'] = make_password(
            validated_data['password']
        )

        return super().create(validated_data)