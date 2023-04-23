from django.shortcuts import render
from rest_framework import generics, status, permissions, mixins
from rest_framework.response import Response
# Create your views here.
from rest_framework import viewsets, permissions, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reservation
from property.models import Property
from .serializers import ReservationSerializer, ReservationActionSerializer, ReservationApproveDenyCancelSerializer
from .filters import ReservationFilter
from accounts.models import CustomUser
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from notification.models import Notification
from rest_framework import serializers
from django.db.models import Q

from datetime import date

class ReservationPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ReservationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReservationSerializer
    pagination_class = ReservationPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReservationFilter

    def get_queryset(self):
        user = self.request.user
        return Reservation.objects.filter(Q(user=user) | Q(property__owner=user))
    
# Reserve
class ReservationCreateView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        u = get_object_or_404(CustomUser, username=self.request.user.username)
        property_instance = self.request.data.get('property')
        property_obj = Property.objects.get(id=property_instance)

        # Check if the user is the owner of the property
        if property_obj.owner == u:
            response = {
                'message': 'You cannot create a reservation for your own property.'
            }
            raise serializers.ValidationError(response)

        property_name = property_obj.name
        serializer.save(user=self.request.user, state=Reservation.PENDING, property_name=property_name)

        property_owner = property_obj.owner
        Notification.objects.create(
            recipient=property_owner,
            content=f"{u.username} has requested to reserve your property {property_name}."
        )

# Cancel
class ReservationCancelView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        reservation = self.get_object()
        if reservation.user == self.request.user:
            reservation.state = Reservation.PENDING_CANCEL
            reservation.save()
            
            property_instance = self.request.data.get('property')
            property_name = Property.objects.get(id=property_instance).name
            property_owner = Property.objects.get(id=property_instance).owner
            Notification.objects.create(recipient=property_owner, content=f"{reservation.user.username} has requested to cancel the reservation of your property {property_name}.")

class ReservationApproveDenyCancelView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationApproveDenyCancelSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        reservation = self.get_object()
        u = get_object_or_404(CustomUser, username=self.request.user.username)
        property_owner = reservation.property.owner
        if u == property_owner:
            action = self.request.data.get('action', None)
            if action == 'approve':
                if reservation.state == Reservation.PENDING_CANCEL:
                    reservation.state = Reservation.CANCELED
                    Notification.objects.create(recipient=reservation.user, content=f"{u.username} has approved your cancellation of {reservation.property.name}.")
                else:
                    reservation.state = Reservation.APPROVED
                    Notification.objects.create(recipient=reservation.user, content=f"{u.username} has approved your request to reserve {reservation.property.name}.")
            elif action == 'deny':
                if reservation.state == Reservation.PENDING_CANCEL:
                    reservation.state = Reservation.PENDING
                    Notification.objects.create(recipient=reservation.user, content=f"{u.username} has denied your cancellation of {reservation.property.name}.")
                else:
                    reservation.state = Reservation.DENIED
                    Notification.objects.create(recipient=reservation.user, content=f"{u.username} has denied your request to reserve {reservation.property.name}.")
            elif action == 'approve_cancel':
                reservation.state = Reservation.CANCELED
                Notification.objects.create(recipient=reservation.user, content=f"{u.username} has approved your cancellation of {reservation.property.name}.")
            elif action == 'deny_cancel':
                reservation.state = Reservation.PENDING
                Notification.objects.create(recipient=reservation.user, content=f"{u.username} has denied your cancellation of {reservation.property.name}.")
            elif action == 'terminate':
                reservation.state = Reservation.TERMINATED
                Notification.objects.create(recipient=reservation.user, content=f"{u.username} has terminated your reservation of {reservation.property.name}.")
            reservation.save()
        else:
            raise PermissionDenied("You are not the owner of this property.")

class ReservationTerminateView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        reservation = self.get_object()
        property_owner = reservation.property.owner
        if self.request.user == property_owner:
            reservation.state = Reservation.TERMINATED
            reservation.save()
        else:
            raise PermissionDenied("You are not the owner of this property.")

class ReservationExpireView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        reservation = self.get_object()
        if reservation.state == Reservation.PENDING and date.today() >= reservation.from_date:
            reservation.state = Reservation.EXPIRED
            reservation.save()