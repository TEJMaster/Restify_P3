from django.urls import path
from .views import PropertyCreateAPIView, PropertyUpdateAPIView, PropertyListAPIView, PropertyDeleteAPIView, PropertySearchView, CheckUniquePropertyName

urlpatterns = [
    path('create/', PropertyCreateAPIView.as_view(), name='property_create'),
    path('update/<int:pk>/', PropertyUpdateAPIView.as_view(), name='property_update'),
    path('list/', PropertyListAPIView.as_view(), name='property_list'),
    path('delete/<int:pk>/', PropertyDeleteAPIView.as_view(), name='property_delete'),
    path('search/', PropertySearchView.as_view(), name='property_search'),
    path('check_unique_name/<str:property_name>/', CheckUniquePropertyName, name='check_unique_property_name'),
]