from django_filters import rest_framework as filters
from .models import Property, Reservation
from accounts.models import CustomUser
from django.shortcuts import get_object_or_404

class ReservationFilter(filters.FilterSet):
    user_type = filters.ChoiceFilter(label='User Type', choices=[('host', 'Host'), ('guest', 'Guest')], method='filter_user_type')
    state = filters.ChoiceFilter(choices=Reservation.RESERVATION_STATES, label='State')

    class Meta:
        model = Reservation
        fields = fields = ['user_type', 'state']
        
    def filter_user_type(self, queryset, name, value):
        u = get_object_or_404(CustomUser, username=self.request.user.username)
        
        if value == 'host':
            return queryset.filter(property__owner=u)
        elif value == 'guest':
            return queryset.filter(user=u)
        else:
            return queryset
