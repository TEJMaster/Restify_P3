from django.urls import path
from django.contrib import admin

from .views import CommentOnPropertyView, ReplyToCommentView, DisplayPropertyCommentsView, UserCommentsView, UserCommentCreateView, TargetUserCommentsView

app_name = 'comments'

urlpatterns = [
    path('comment/property/<int:property_id>', CommentOnPropertyView.as_view()),
    path('reply/<int:comment_id>', ReplyToCommentView.as_view()),
    path('view/property/<int:property_id>', DisplayPropertyCommentsView.as_view()),
    path('myComments', UserCommentsView.as_view()),
    path('comment/user', UserCommentCreateView.as_view()),
    path('view/user/<str:target_username>', TargetUserCommentsView.as_view()),
]