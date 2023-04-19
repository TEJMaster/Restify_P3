
from django.db import models
from accounts.models import CustomUser
from property.models import Property


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    content = models.TextField()
    rate = models.IntegerField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class UserComment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='authored_user_comments')
    target_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_comments')
    content = models.TextField()
    rate = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
