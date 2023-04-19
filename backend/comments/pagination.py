from rest_framework.pagination import PageNumberPagination

class CommentPagination(PageNumberPagination):
    page_size = 5  # Set the number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100  # Set the maximum number of items per page