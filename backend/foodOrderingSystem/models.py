from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from django.conf import settings


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
    ORDER_STATUS_CHOICES = (
        ('New', 'New Order'),
        ('Confirmed', 'Confirm Order'),
        ('Preparing', 'Food Being Prepared'),
        ('Pickup', 'Food Pickup'),
        ('Delivered', 'Food Delivered'),
        ('Cancelled', 'Cancelled Order'),
    )
    
    user              = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_orders')
    food              = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='food_orders')
    quantity          = models.PositiveIntegerField(default=1)
    is_order_placed   = models.BooleanField(default=False)
    order_number      = models.CharField(max_length=50, unique=True, null=True, blank=True, default=None)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Saves price trends securely")
    status            = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='New')
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
    
    



class OrderAddress(models.Model):
    ADDRESS_TAG_CHOICES  = [('HOME', 'Home (All-Day Delivery)'),('OFFICE', 'Office (Work Hours Delivery)'),('OTHER', 'Other (Custom/Friends)'),]
    user                 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_addresses',help_text="The customer who owns this address record.")
    contact_person_name  = models.CharField(max_length=150, help_text="Full name of the individual receiving the package.")
    contact_person_phone = models.CharField(max_length=20, help_text="Primary phone number for delivery rider coordination.")
    alternative_phone    = models.CharField(max_length=20, blank=True, null=True, help_text="Secondary number if the primary contact is unreachable.")
    street_address       = models.CharField(max_length=255, help_text="House number, apartment/suite number, block, or street identifier.")
    area_or_neighborhood = models.CharField(max_length=150, help_text="Specific area, block, or neighborhood (e.g., Gulshan, Dhanmondi, Mirpur).")
    city_or_division     = models.CharField(max_length=100,help_text="The city or administrative division name (e.g., Dhaka, Chattogram).")
    postal_code          = models.CharField(max_length=20,blank=True, null=True,help_text="Postal or ZIP code.")
    delivery_landmark    = models.TextField(blank=True, null=True, help_text="Any notable landmarks nearby (e.g., 'Opposite the Jamuna Future Park gate').")
    latitude             = models.DecimalField(max_length=50, max_digits=9, decimal_places=6, blank=True, null=True, help_text="GPS Latitude tracking coordinate map marker pin.")
    longitude            = models.DecimalField(max_length=50,max_digits=9, decimal_places=6,blank=True, null=True, help_text="GPS Longitude tracking coordinate map marker pin.")
    address_tag          = models.CharField(max_length=10, choices=ADDRESS_TAG_CHOICES, default='HOME',help_text="Categorization label for rapid user selection dashboards.")
    is_default           = models.BooleanField(default=False, help_text="Designates if this profile is preferred for instant checkout calculations.")
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Delivery Address"
        verbose_name_plural = "Delivery Addresses"
        ordering            = ['-is_default', '-created_at']

    def save(self, *args, **kwargs):
        if self.is_default:
            OrderAddress.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super(OrderAddress, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.first_name or self.user.id} - {self.address_tag} ({self.area_or_neighborhood}, {self.city_or_division})"
    
    
    
class Payment(models.Model):
    PAYMENT_METHODS = (
        ('bkash', 'bKash Mobile Wallet'),
        ('nagad', 'Nagad Mobile Wallet'),
        ('card', 'Credit/Debit Card'),
        ('cod', 'Cash on Delivery'),
    )

    PAYMENT_STATUS = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Refunded', 'Refunded'),
    )

    user  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='payments')
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='cod')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='Pending')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.payment_method} - {self.payment_status} (${self.amount})"
    
    