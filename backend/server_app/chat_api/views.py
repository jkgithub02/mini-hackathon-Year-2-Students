from django.shortcuts import render
from django.http import JsonResponse
import uuid;

def test_view(request):
    data = {
        "id": str(uuid.uuid4()),
        "chatPrompt": "Hello, how are you?",
        "botMessage": "I'm doing well, thanks for asking!"
    }
    return JsonResponse(data)