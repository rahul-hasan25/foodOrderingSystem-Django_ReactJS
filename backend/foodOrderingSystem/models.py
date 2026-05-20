from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField(max_length=50, unique=True)
    mobile     = models.BigIntegerField()
    password   = models.CharField(max_length=50)
    reg_date   = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    

class Category(models.Model):
    category_name = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.category_name
    


class Food(models.Model):
    category         = models.ForeignKey(Category, on_delete=models.CASCADE)
    item_name        = models.CharField(max_length=100)
    item_price       = models.DecimalField(max_digits=10, decimal_places=2)
    item_description = models.TextField(max_length=500, null=True, blank=True)
    image            = models.ImageField(upload_to='food_images/')
    item_quantity    = models.CharField(max_length=50)
    is_available     = models.BooleanField(default=True)
    
    discount_price   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    shipping_charge  = models.DecimalField(max_digits=5, decimal_places=2, default=40.00)
    preparation_time = models.IntegerField(default=20, help_text="Time in minutes")
    calories         = models.IntegerField(null=True, blank=True, help_text="kcal counter")
    dietary_tags     = models.CharField(max_length=100, default="Fresh, Organic", help_text="Comma separated tags")
    
    def __str__(self):
        return self.item_name
    


class Review(models.Model):
    food       = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    rating     = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment    = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.food.item_name} ({self.rating}★)"
    
    


class Orders(models.Model):
    user              = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_orders')
    food              = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='food_orders')
    quantity          = models.PositiveIntegerField(default=1)
    is_order_placed   = models.BooleanField(default=False)
    order_number      = models.CharField(max_length=50, unique=True, null=True, blank=True, default=None)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Saves price trends securely")
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    
    @property
    def total_price(self):
        if self.is_order_placed and self.price_at_purchase:
            return self.price_at_purchase * self.quantity
        current_price = self.food.discount_price if self.food.discount_price else self.food.item_price
        return current_price * self.quantity

    def save(self, *args, **kwargs):
        if self.is_order_placed and not self.order_number:
            self.order_number = f"FEX-{uuid.uuid4().hex[:10].upper()}"
            if not self.price_at_purchase:
                self.price_at_purchase = self.food.discount_price if self.food.discount_price else self.food.item_price
        super().save(*args, **kwargs)

    def __str__(self):
        status = f"Placed ({self.order_number})" if self.is_order_placed else "In-Cart"
        return f"{self.user.first_name} - {self.food.item_name} ({status})"