from django.urls import path

from .views import CurrentUserView, UserDetailView, UserListCreateView

urlpatterns = [
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('users/', UserListCreateView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
