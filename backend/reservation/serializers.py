from rest_framework import serializers
from .models import Reservation, Property
from pprint import pprint
from property.models import PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image']
        
class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = ['id', 'name', 'owner', 'price', 'images']

class ReservationSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'property', 'from_date', 'to_date', 'state']
        read_only_fields = ['user', 'state']

    def validate(self, data):
        if data['to_date'] <= data['from_date']:
            raise serializers.ValidationError("The 'to_date' must be later than the 'from_date'")  
        pprint(data['property'])
        property = data['property']
        
        if data['from_date'] < property.from_date or data['to_date'] > property.to_date:
            raise serializers.ValidationError("The reservation dates must be within the property's available dates.")

        
        duplicate_reservations = Reservation.objects.filter(
            property=data['property'],
            from_date__lte=data['to_date'],
            to_date__gte=data['from_date'],
            state = Reservation.PENDING or Reservation.APPROVED or Reservation.PENDING_CANCEL,
        )
        # also check if the reservation is already canceled or denied
        if duplicate_reservations.exists():
            raise serializers.ValidationError("The property is already booked during the specified dates.")

        return data

class ReservationActionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'property', 'from_date', 'to_date', 'state']
        read_only_fields = ['id', 'user', 'property', 'from_date', 'to_date', 'state']


      
class ReservationApproveDenyCancelSerializer(serializers.ModelSerializer):
    action = serializers.ChoiceField(choices=['approve', 'deny', 'approve_cancel', 'deny_cancel', 'terminate'])

    class Meta:
        model = Reservation
        fields = ['id', 'action',]

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     instance = kwargs.get('instance', None)
    #     if instance:
    #         if instance.state == Reservation.PENDING_CANCEL:
    #             self.fields['action'].choices = [
    #                 ('approve_cancel', 'Approve Cancel'),
    #                 ('deny_cancel', 'Deny Cancel'),
    #             ]
    #         else:
    #             self.fields['action'].choices = [
    #                 ('approve', 'Approve'),
    #                 ('deny', 'Deny'),
    #             ]
    
class ReservationListSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only = True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'property', 'from_date', 'to_date', 'state']
