from django.urls import path
from .views import ReservationViewSet, ReservationCreateView, ReservationCancelView, ReservationApproveDenyCancelView, ReservationTerminateView
urlpatterns = [
    path('', ReservationViewSet.as_view({'get': 'list'}), name='reservation-list'),
    path('reserve/', ReservationCreateView.as_view(), name='reservation-create'),
    path('cancel/<int:pk>/', ReservationCancelView.as_view(), name='reservation-cancel'),
    path('approve-deny-cancel/<int:pk>/', ReservationApproveDenyCancelView.as_view(), name='reservation-approve-deny-cancel'),
    path('terminate/<int:pk>/', ReservationTerminateView.as_view(), name='reservation-terminate'),
]