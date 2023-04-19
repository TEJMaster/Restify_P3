from django_filters import rest_framework as filters
from .models import Property

class PropertyFilter(filters.FilterSet):
    location = filters.CharFilter(field_name="location", lookup_expr='icontains')
    from_date = filters.DateFilter(field_name="from_date", lookup_expr='gte')
    to_date = filters.DateFilter(field_name="to_date", lookup_expr='lte')
    num_guests = filters.NumberFilter(field_name="guests", lookup_expr='gte')
    amenities = filters.CharFilter(field_name="amenities", lookup_expr='icontains')

    class Meta:
        model = Property
        fields = ['location', 'from_date', 'to_date', 'num_guests', 'amenities']