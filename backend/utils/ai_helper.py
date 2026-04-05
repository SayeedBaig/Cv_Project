import os

import requests
try:
    from dotenv import load_dotenv
except ModuleNotFoundError:
    def load_dotenv():
        return False

load_dotenv()

API_KEY = os.getenv("API_KEY")


def get_ai_response(data):
    if not API_KEY:
        return "Drive safely"

    prompt = f"""
    You are an advanced road safety assistant.

    Analyze the situation:

    {data}

    Give output in this format:

    Alert: <short alert>
    Recommendation: <clear action>

    Make it realistic, practical, and specific to driving.
    """

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-pro:generateContent?key={API_KEY}"
    )

    response = requests.post(
        url,
        json={
            "contents": [
                {
                    "parts": [{"text": prompt}],
                }
            ]
        },
        timeout=30,
    )

    result = response.json()

    try:
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return "Drive safely"
