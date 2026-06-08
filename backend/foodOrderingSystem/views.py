from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User as AdminUser
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, viewsets

# FIX 1: Explicitly import your app's custom User model using an alias to avoid clashes
from .models import (
    User as CustomerUser,
    Category,
    Food,
    Review,
    Orders,
    OrderAddress,
    Payment
)
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, Sum, Count
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import action
from decimal import Decimal
from django.utils import timezone
import uuid
import logging
from collections import defaultdict


#<--------ADMIN-------->
#Login Page
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_view(request):
    username_input = request.data.get('username')
    password_input = request.data.get('password')
    
    if not username_input or not password_input:
        return Response(
            {
                'success': False,
                'message': 'FoodFlex admin credentials are incomplete.'
            }, status=status.HTTP_400_BAD_REQUEST
        )
        
    try:
        try:
            # Safely targets django.contrib.auth.models.User
            admin_user = AdminUser.objects.get(username=username_input)
        except AdminUser.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid administrative user credentials.'
                }, status=status.HTTP_401_UNAUTHORIZED
            )
        if admin_user.check_password(password_input):
            if admin_user.is_staff or admin_user.is_superuser:
                return Response(
                    {
                        'success': True,
                        'message': f'Welcome back to Central Kitchen Operations, {admin_user.username}!',
                        'username': admin_user.username
                    }, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        'success': False,
                        'message': 'Access Denied: Account lacks administrative system flags.'
                    }, status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid administrative user credentials.'
                }, status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {
                'success': False,
                'message': f"Internal Server Authentication Error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
#ADMIN Sidebar
#Add Category
@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')
    Category.objects.create(category_name=category_name)
    return Response(
        {
            'success' : True,
            'message' : 'Category has been created!'
        }, status=status.HTTP_201_CREATED
    )


#Manage Category
@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


class CategoryDetailAPIView(APIView):
    def put(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return Response(
            {"message": "Category deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )
        
        

# Add Food
class CategoryListAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FoodCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


#Manage FOOD
class FoodListDestroyAPIView(APIView):
    def get(self, request):
        foods = Food.objects.all().select_related('category')
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FoodDetailAPIView(APIView):
    def put(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        food.delete()
        return Response({"message": "Food item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



# Search Page 
@api_view(['GET'])
def search_food(request):
    query = request.GET.get('q', '')
    
    if query:
        foods = Food.objects.filter(
            Q(item_name__icontains=query) | 
            Q(item_description__icontains=query)
        )
    else:
        foods = Food.objects.all()
        
    serializer = FoodSerializer(foods, many=True, context={'request': request})
    return Response(serializer.data)


# Home Page Food Item
@api_view(['GET'])
def get_homepage_featured_menu(request):
    featured_foods = Food.objects.filter(is_available=True).order_by('?')[:8]
    
    serializer = FoodSerializer(featured_foods, many=True, context={'request': request})
    return Response(serializer.data)



# User Registration
@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
    serializer = UserRegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        return Response({
            "success": True,
            "message": "Welcome aboard! Your account has been created successfully.",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "mobile": user.mobile
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
    


# User Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    identity = request.data.get('identity')
    password = request.data.get('password')

    if not identity or not password:
        return Response({
            "success": False,
            "message": "Please provide both identity and password."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        identity_str = str(identity).strip()
        
        # Safe structural conditional routing
        if '@' in identity_str:
            user = CustomerUser.objects.get(email=identity_str)
        elif identity_str.isdigit():
            # PASS AS STRING to preserve structural leading zeros
            user = CustomerUser.objects.get(mobile=identity_str) 
        else:
            return Response({
                "success": False,
                "message": "Invalid application client identifier format."
            }, status=status.HTTP_400_BAD_REQUEST)

        if check_password(password, user.password):
            return Response({
                "success": True,
                "message": f"Welcome back, {user.first_name}!",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "mobile": user.mobile
                }
            }, status=status.HTTP_200_OK)

        return Response({"success": False, "message": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)

    except CustomerUser.DoesNotExist:
        return Response({"success": False, "message": "User account record not found."}, status=status.HTTP_404_NOT_FOUND)
        
        

# Product Detail
class FoodViewSet(viewsets.ModelViewSet):
    queryset         = Food.objects.all()
    serializer_class = FoodDetailSerializer

    @action(detail=True, methods=['get', 'post', 'put', 'patch', 'delete', 'head', 'options'], url_path='add-review')
    def add_review(self, request, pk=None):
        food_item = self.get_object()
        user_id   = request.data.get('user_id')
        rating    = request.data.get('rating')
        comment   = request.data.get('comment')

        if not user_id or not rating or not comment:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomerUser.objects.get(id=user_id)
        except CustomerUser.DoesNotExist:
            return Response({"error": "User session invalid or not found."}, status=status.HTTP_404_NOT_FOUND)

        review = Review.objects.create(
            food   = food_item,
            user   = user,
            rating = int(rating),
            comment= comment
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    
    
    
# Add to Cart Link    
@api_view(['POST'])
def add_to_cart_view(request):
    user_id  = request.headers.get('X-User-Id') or request.data.get('user_id')
    food_id  = request.data.get('food_id')
    quantity = int(request.data.get('quantity', 1))

    if not user_id:
        return Response({'success': False, 'message': 'Authentication required. Missing user key.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_obj = get_object_or_404(CustomerUser, id=user_id)
    food_obj = get_object_or_404(Food, id=food_id)

    if not food_obj.is_available:
        return Response({'success': False, 'message': 'This premium item is currently out of stock.'}, status=status.HTTP_400_BAD_REQUEST)

    cart_item, created = Orders.objects.get_or_create(
        user=user_obj,
        food=food_obj,
        is_order_placed=False, 
        defaults={'quantity': quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({
        'success': True,
        'message': f'"{food_obj.item_name}" has been placed in your dining collection container.'
    }, status=status.HTTP_200_OK)
    
    
    

# Manage Cart
@api_view(['GET', 'POST'])
def manage_cart(request):
    user_id = request.headers.get('X-User-Id') or request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Authentication tracking token missing.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_obj = get_object_or_404(CustomerUser, id=user_id)

    if request.method == 'GET':
        cart_items       = Orders.objects.filter(user=user_obj, is_order_placed=False).order_by('-created_at')
        serializer       = CartItemSerializer(cart_items, many=True)
        subtotal         = Decimal('0.00')
        highest_shipping = Decimal('0.00')
        
        for item in cart_items:
            price = item.food.discount_price if item.food.discount_price else item.food.item_price
            subtotal += price * item.quantity
            
            if item.food.shipping_charge > highest_shipping:
                highest_shipping = item.food.shipping_charge
        
        shipping_fee = Decimal('0.00') if subtotal >= Decimal('500.00') or subtotal == 0 else highest_shipping
        grand_total  = subtotal + shipping_fee

        return Response({
            'items'  : serializer.data,
            'summary': {
                'subtotal': float(subtotal),
                'shipping_fee': float(shipping_fee),
                'free_delivery_threshold': 500.00,
                'grand_total': float(grand_total)
            }
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_cart_quantity(request, item_id):
    user_id   = request.headers.get('X-User-Id')
    cart_item = get_object_or_404(Orders, id=item_id, user_id=user_id, is_order_placed=False)
    action    = request.data.get('action') 
    
    if action == 'increase':
        cart_item.quantity += 1
    elif action == 'decrease' and cart_item.quantity > 1:
        cart_item.quantity -= 1
    else:
        return Response({'error': 'Invalid operational bounds request.'}, status=status.HTTP_400_BAD_REQUEST)
        
    cart_item.save()
    return Response({'success': True, 'message': 'Quantity updated.'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    user_id   = request.headers.get('X-User-Id')
    cart_item = get_object_or_404(Orders, id=item_id, user_id=user_id, is_order_placed=False)
    cart_item.delete()
    return Response({'success': True, 'message': 'Dishes extracted from your order collection.'}, status=status.HTTP_200_OK)



# Cart icon item count
@api_view(['GET'])
def get_cart_count(request):
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        return Response({'cart_count': 0}, status=status.HTTP_200_OK)
    user_obj = get_object_or_404(CustomerUser, id=user_id)

    cart_aggregation = Orders.objects.filter(
        user=user_obj, 
        is_order_placed=False
    ).aggregate(total_items=Sum('quantity'))
    
    count = cart_aggregation.get('total_items') or 0
    
    return Response({'cart_count': count}, status=status.HTTP_200_OK)



# Proceed to secure checkout
@api_view(['GET', 'POST'])
def checkout_address_view(request):
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        return Response({'error': 'Unauthorized authentication context.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_obj = get_object_or_404(CustomerUser, id=user_id)

    if request.method == 'GET':
        addresses  = OrderAddress.objects.filter(user=user_obj)
        serializer = OrderAddressSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = OrderAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


logger = logging.getLogger(__name__)

#<-------- CHECKOUT VIEW -------->
@api_view(['POST'])
@permission_classes([AllowAny])
def place_order_checkout(request):
    try:
        data = request.data
        logger.info(f"Incoming Checkout Payload Data: {data}")

        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"success": False, "error": "Unauthorized context mapping identity missing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_obj = get_object_or_404(CustomerUser, id=user_id)

        address_id     = data.get('address_id')
        payment_method = data.get('payment_method', 'cod').lower()
        grand_total    = data.get('grand_total', 0)

        if not address_id:
            return Response({"success": False, "error": "Please provide a valid delivery address identifier destination."}, status=status.HTTP_400_BAD_REQUEST)
        
        get_object_or_404(OrderAddress, id=address_id, user=user_obj)

        cart_items = Orders.objects.filter(user=user_obj, is_order_placed=False)
        if not cart_items.exists():
            return Response({"success": False, "error": "Your checkout workspace array ledger collection is completely empty."}, status=status.HTTP_400_BAD_REQUEST)

        batch_order_number = f"FEX-{timezone.now().strftime('%Y%m%d%H%M%S')}-{user_obj.id}"
        
        payment_details_list = []
        ordered_items_list = list(cart_items)
        
        for index, item in enumerate(ordered_items_list):
            item.is_order_placed = True
            item.order_number = f"{batch_order_number}-{index + 1}"  
            item.price_at_purchase = item.food.discount_price if item.food.discount_price else item.food.item_price
            item.save()

            item_tx_id = f"TXN-{uuid.uuid4().hex[:10].upper()}"
            
            payment = Payment.objects.create(
                user           =user_obj,
                order          =item,  
                payment_method =payment_method,
                amount         =float(item.price_at_purchase * item.quantity), 
                transaction_id =item_tx_id,
                payment_status ='Completed' if payment_method in ['bkash', 'card'] else 'Pending'
            )
            
            food_title = (
                getattr(item.food, 'food_name', None) or 
                getattr(item.food, 'item_name', None) or 
                getattr(item.food, 'name', None) or 
                str(item.food)
            )
            
            payment_details_list.append({
                "payment_id"     : payment.id,
                "order_number"   : item.order_number,
                "food_name"      : food_title, 
                "method"         : payment.payment_method,
                "status"         : payment.payment_status,
                "amount_paid"    : float(payment.amount),
                "transaction_id" : payment.transaction_id
            })

        return Response({
            "success"  : True,
            "message"  : "Success! Order placed!",
            "order_id" : batch_order_number, 
            "payment_details": payment_details_list 
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"CRITICAL BACKEND CHECKOUT EXCEPTION: {str(e)}", exc_info=True)
        return Response({"success": False, "error": f"Internal Server Error processing database write instructions: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# My Order Page
class MyOrdersListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id', 1) 
        
        queryset = Orders.objects.filter(
            user_id=user_id, 
            is_order_placed=True
        ).select_related('food').prefetch_related('payments').order_by('-created_at')
        
        serializer = MyOrdersGroupSerializer(queryset, many=True)
        
        grouped_orders = defaultdict(list)
        for item in serializer.data:
            grouped_orders[item['order_number']].append(item)
            
        formatted_response = []
        for order_no, items in grouped_orders.items():
            first_item = items[0]
            
            subtotal = sum(float(i['total_price']) for i in items)
            shipping_charge = sum(float(i['food']['shipping_charge']) * int(i['quantity']) for i in items)
            grand_total = subtotal + shipping_charge
            
            payment_info = {
                "payment_method": "cod",
                "payment_status": "Pending",
                "transaction_id": None
            }
            
            for o in queryset:
                if o.order_number == order_no:
                    active_payment = o.payments.first() 
                    if active_payment:
                        payment_info = {
                            "payment_method": active_payment.payment_method,
                            "payment_status": active_payment.payment_status,
                            "transaction_id": active_payment.transaction_id
                        }
                        break
            
            status_map = "Processing"
            if payment_info["payment_status"] == "Completed":
                status_map = "Confirmed"
            elif payment_info["payment_status"] == "Failed":
                status_map = "Cancelled"
                
            formatted_response.append({
                "order_number": order_no,
                "date": first_item['date_formatted'],
                "status": status_map,
                "subtotal": subtotal,
                "shipping_charge": shipping_charge,
                "grand_total": grand_total,
                "payment_info": payment_info,
                "items": items
            })
            
        return Response(formatted_response)
    
    

# My Profile
class UserProfileDetailView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "Authentication token context missing."}, status=status.HTTP_401_UNAUTHORIZED)
            
        user_profile = get_object_or_404(CustomerUser, id=user_id)
        serializer   = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "Authentication token context missing."}, status=status.HTTP_401_UNAUTHORIZED)
            
        user_profile = get_object_or_404(CustomerUser, id=user_id)
        serializer   = UserProfileSerializer(user_profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Your dining profile credentials have been successfully synced.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    

# User Setting
class UserSettingsCoreAPIView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        user_id  = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "User header missing."}, status=status.HTTP_401_UNAUTHORIZED)
        user_obj = get_object_or_404(CustomerUser, id=user_id)
        return Response(SettingsUserSerializer(user_obj).data, status=status.HTTP_200_OK)

    def put(self, request):
        user_id    = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "User header missing."}, status=status.HTTP_401_UNAUTHORIZED)
        user_obj   = get_object_or_404(CustomerUser, id=user_id)
        serializer = SettingsUserSerializer(user_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateSecurityCredentialsAPIView(APIView):
    def post(self, request):
        user_id    = request.headers.get('X-User-Id')
        user_obj   = get_object_or_404(CustomerUser, id=user_id)
        serializer = PasswordUpdateSerializer(data=request.data, context={'request_user': user_obj})
        
        if serializer.is_valid():
            user_obj.set_password(serializer.validated_data['new_password'])
            user_obj.save()
            return Response({"success": True, "message": "Security matrix successfully updated."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressSettingsCollectionAPIView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        user_id   = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "User header missing."}, status=status.HTTP_401_UNAUTHORIZED)
        addresses = OrderAddress.objects.filter(user_id=user_id)
        return Response(SettingsAddressSerializer(addresses, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        user_id    = request.headers.get('X-User-Id')
        if not user_id:
            return Response({"error": "User header missing."}, status=status.HTTP_401_UNAUTHORIZED)
        user_obj   = get_object_or_404(CustomerUser, id=user_id)
        serializer = SettingsAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class PermanentlyDeleteProfileAPIView(APIView):
    def delete(self, request):
        user_id = request.headers.get('X-User-Id')
        user_obj = get_object_or_404(CustomerUser, id=user_id)
        
        password_confirmation = request.data.get('password_confirmation')
        
        if not password_confirmation:
            return Response(
                {"error": "Account password verification is required to confirm identity closure."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # FIX: Check the raw password input safely against the encrypted hash string
        if not user_obj.check_password(password_confirmation):
            return Response(
                {"error": "Security validation credential mismatch. Deletion rejected."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        user_obj.delete()
        return Response(
            {"success": True, "message": "User registry data scrubbed from live records cleanly."}, 
            status=status.HTTP_200_OK
        )
        
        
        
        

# Admin Orders ---> All Orders
class AdminAllOrdersManagementAPI(APIView):
    def get(self, request):
        queryset = Orders.objects.filter(is_order_placed=True).order_by('-created_at')

        search_query = request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(user__first_name__icontains=search_query) |
                Q(user__last_name__icontains=search_query) |
                Q(user__email__icontains=search_query) |
                Q(food__item_name__icontains=search_query)
            )
 
        payment_filter = request.query_params.get('status', '').strip()
        if payment_filter:
            queryset = queryset.filter(payments__payment_status=payment_filter)

        total_placed_count = queryset.count()
        
        total_revenue = 0
        for order in queryset:
            total_revenue += order.total_price

        completed_payments = Orders.objects.filter(is_order_placed=True, payments__payment_status='Completed').count()
        pending_payments   = Orders.objects.filter(is_order_placed=True, payments__payment_status='Pending').count()

        serializer = AdminOrderDetailsSerializer(queryset, many=True)
        
        return Response({
            'metrics': {
                'total_orders'      : total_placed_count,
                'total_revenue'     : float(total_revenue),
                'completed_payments': completed_payments,
                'pending_payments'  : pending_payments
            },
            'orders': serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        order_item = Orders.objects.filter(id=pk).first()
        if not order_item:
            return Response({"error": "Targeted order matching token values not found."}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('payment_status')
        if new_status:
            payment_record = Payment.objects.filter(order=order_item).first()
            if payment_record:
                payment_record.payment_status = new_status
                payment_record.save()
                return Response({"success": "Order pipeline verification metrics modified smoothly."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No matching transactional profile detected to apply status change."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({"error": "Missing standard parameters context request body fields."}, status=status.HTTP_400_BAD_REQUEST)