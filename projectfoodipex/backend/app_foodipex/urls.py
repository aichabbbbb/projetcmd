from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import UserView, login_view, GroupView, GroupPermissionsView, RestaurantListView, UserPermissionsAPIView, \
    GroupDetailView, profile_view, CityListView ,  GetCFAchatFoodipex , ReptureStock , TotalRotationStockView , TopStockArticlesView , GetCFAVenderesto , GetCFAchatFoodipexFlat , GetCAByYearMonth , GetTopGuests , GetTopTransactions , TickMoyen , GetTop10RestaurantsByCA , NombreDeVillesView , CARestaurantsView , NombreDeRestaurantsView , CAFoodipexView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Login endpoint for obtaining tokens

    path('login/', login_view, name='login'),

    # User detail endpoints
    path('users/', UserView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserView.as_view(), name='user-detail'),

    # JWT token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/groups/', GroupView.as_view(), name='group-list-create'),
    path('groups/<int:group_id>/permissions/', GroupPermissionsView.as_view(), name='group_permissions'),
    path('groups/<int:group_id>/permissions/<int:permission_id>/', GroupPermissionsView.as_view(),
         name='group_permission_detail'),
    path('restaurants/', RestaurantListView.as_view(), name='restaurant-list'),
    path('restaurants/<str:city>/', RestaurantListView.as_view(), name='restaurant-list-by-city'),

    path('cities/', CityListView.as_view(), name='city-list'),  # URL pour lister toutes les villes
    path('api/user/permissions/', UserPermissionsAPIView.as_view(), name='user-permissions'),
    path('api/groups/<int:pk>/', GroupDetailView.as_view(), name='group-detail'),

    path('api/profile/', profile_view, name='get_all_profiles'),  # For getting all profiles
    path('api/profile/<int:user_id>/', profile_view, name='get_profile'),  # For getting a specific profile

    path('GetCFAchatFoodipex/', GetCFAchatFoodipex.as_view()),
    path('GetCAByYearMonth/', GetCAByYearMonth.as_view()),
    path('GetCFAVenderesto/', GetCFAVenderesto.as_view()),
    path('GetCFAchatFoodipexFlat/', GetCFAchatFoodipexFlat.as_view()),
    path('ReptureStock/', ReptureStock.as_view()),
    path('RotationStock/', TotalRotationStockView.as_view()),
    path('TopStockArticlesView/', TopStockArticlesView.as_view()),
    path('GetTopGuests/', GetTopGuests.as_view()),
    path('GetTopTransactions/', GetTopTransactions.as_view()),
    path('TickMoyen/', TickMoyen.as_view()),
    path('GetTop10RestaurantsByCA/', GetTop10RestaurantsByCA.as_view()),
]
