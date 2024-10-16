from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import uuid, json
from .azure_openai import ask_open_ai

@csrf_exempt
def test_view(request):
    data = {
        "id": str(uuid.uuid4()),
        "chatPrompt": "Hello, how are you?",
        "botMessage": "I'm doing well, thanks for asking! King Kong QI Shean"
    }
    return JsonResponse(data)

@require_POST
@csrf_exempt
def askbot_view(request):
    try:
        # Parse the JSON request body
        body_unicode = request.body.decode('utf-8')  # Decode the request body
        body_data = json.loads(body_unicode)  # Parse JSON into a Python dictionary
        
        # Example: Access data from the parsed object
        user_message = body_data.get('query', '')
        
        # Log or print the parsed data
        botResponse = ask_open_ai(user_message)
        print(f"{botResponse}")
        
        # Prepare a response
        response_data = {
            "id": str(uuid.uuid4()),
            "chatPrompt": user_message,
            "botMessage": botResponse
        }
        return JsonResponse(response_data)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)