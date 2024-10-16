from django.urls import path
from .views import test_view
from .views import askbot_view

urlpatterns = [
    path('test/', test_view, name='test'),
    path('ask-bot/', askbot_view, name='askbot_view')
]
