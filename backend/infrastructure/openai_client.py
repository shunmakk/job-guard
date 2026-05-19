import json
from openai import OpenAI

from core.config import OPENAI_API_KEY
from core.prompts import SYSTEM_PROMPT


class OpenAIClient:
    def __init__(self, client: OpenAI | None = None):
        self._client = client or OpenAI(api_key=OPENAI_API_KEY)

    def analyze_job(self, prompt: str) -> dict:
        response = self._client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
