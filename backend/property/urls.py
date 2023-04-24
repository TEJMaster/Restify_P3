from django.urls import path
from .views import PropertyCreateAPIView, PropertyUpdateAPIView, PropertyListAPIView, PropertyDeleteAPIView, PropertySearchView, CheckUniquePropertyName, PropertyDetail, UserPropertiesView

urlpatterns = [
    path('create/', PropertyCreateAPIView.as_view(), name='property_create'),
    path('update/<str:name>/', PropertyUpdateAPIView.as_view(), name='property_update'),
    path('list/', PropertyListAPIView.as_view(), name='property_list'),
    path('delete/<str:name>/', PropertyDeleteAPIView.as_view(), name='property_delete'),
    path('search/', PropertySearchView.as_view(), name='property_search'),
    path('check_unique_name/<str:property_name>/', CheckUniquePropertyName, name='check_unique_property_name'),
    path('my_property/', UserPropertiesView.as_view(), name='my_property'),
    path('<str:name>/', PropertyDetail.as_view(), name='property_detail'),
    # path('id/<int:id>/', PropertyDetailByID.as_view(), name='property_detail_by_id'),
]