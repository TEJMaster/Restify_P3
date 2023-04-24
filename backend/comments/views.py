from rest_framework import generics, permissions, serializers
from .models import Comment, UserComment
from accounts.models import CustomUser
from .serializers import CommentSerializer, CommentReplySerializer, UserCommentSerializer
from property.models import Property
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from .pagination import CommentPagination
from notification.models import Notification

from django.core.exceptions import PermissionDenied

class CommentOnPropertyView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    def perform_create(self, serializer):
        user = self.request.user
        property_id = self.kwargs['property_id']

        try:
            property_instance = Property.objects.get(id=property_id)

            # Make sure the user is not the property owner
            if user == property_instance.owner:
                raise PermissionDenied("Property owners cannot comment on their own property.")

            serializer.save(user=user, property=property_instance)
            property_owner = property_instance.owner
            Notification.objects.create(
                recipient=property_owner,
                content=f"{user.username} has commented on your property {property_instance.name}."
            )
            
        except Property.DoesNotExist:
            raise serializers.ValidationError({"property_id": "Property with id " + str(property_id) + " does not exist."})



class ReplyToCommentView(generics.CreateAPIView):
    serializer_class = CommentReplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        parent_comment_id = self.kwargs['comment_id']

        try:
            parent_comment = Comment.objects.get(id=parent_comment_id)
            property_instance = parent_comment.property

            # Check if the user is the owner of the property before allowing them to reply
            if user != property_instance.owner:
                raise PermissionDenied("Only the property owner can reply to a comment.")

            serializer.save(user=user, property=property_instance, parent_comment=parent_comment, rate=parent_comment.rate)
        except Comment.DoesNotExist:
            raise serializers.ValidationError({"parent_comment_id": "Parent comment with id " + str(parent_comment_id) + " does not exist."})





class DisplayPropertyCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def flatten_comments(self, comments):
        flattened = []
        for comment in comments:
            flattened.append(comment)
            replies = Comment.objects.filter(parent_comment=comment).order_by('created_at')
            flattened.extend(replies)
        return flattened

    def get_queryset(self):
        property_id = self.kwargs['property_id']
        comments = Comment.objects.filter(property_id=property_id, parent_comment=None).order_by('created_at')
        return self.flatten_comments(comments)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Paginate the queryset
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = self.modify_serializer_data(serializer.data)
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = self.modify_serializer_data(serializer.data)
        return Response(data)

    def modify_serializer_data(self, data):
        modified_data = []

        for item in data:
            modified_item = item.copy()
            modified_item['user'] = item['user']['username']
            if item.get('parent_comment'):
                modified_item.pop('rate', None)
                modified_item['parent_comment'] = item['parent_comment']
            modified_data.append(modified_item)

        return modified_data





class UserCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user)
    
    
    
class UserCommentCreateView(generics.CreateAPIView):
    queryset = UserComment.objects.all()
    serializer_class = UserCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        target_username = self.request.data.get('target_username')
        
        try:
            target_user = CustomUser.objects.get(username=target_username)
        except CustomUser.DoesNotExist:
            raise ValidationError({"detail": f"Target user '{target_username}' does not exist."})
        
        if user == target_user:
            raise ValidationError({"detail": "You cannot comment on yourself."})
        
        if UserComment.objects.filter(author=user, target_user=target_user).exists():
            raise ValidationError({"detail": "You have already commented on this user."})
        
        serializer.save(author=user)


class TargetUserCommentsView(generics.ListAPIView):
    serializer_class = UserCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CommentPagination

    def get_queryset(self):
        target_username = self.kwargs['target_username']
        target_user = CustomUser.objects.get(username=target_username)
        return UserComment.objects.filter(target_user=target_user)

