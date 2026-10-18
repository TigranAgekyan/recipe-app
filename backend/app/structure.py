import json
import os
import sys

import anthropic
from pydantic import BaseModel

from app.transcribe import get_transcript

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
MODEL = os.getenv("LLM_MODEL", "claude-haiku-5-5")


class Ingredient(BaseModel):
    name: str
    quantity: str | None = None
    unit: str | None = None
    note: str | None = None


class Recipe(BaseModel):
    is_recipe: bool
    title: str
    servings: int | None = None
    total_time_minutes: int | None = None
    ingredients: list[Ingredient]
    steps: list[str]


SYSTEM = """You extract recipes from cooking video transcripts and descriptions.
- Use only information present in the input. Never invent amounts.
- If the description lists exact amounts, prefer them over the transcript.
- If an amount isn't stated, leave quantity null.
- Write everything in English.
- Steps are short, imperative, and in order.
- If the content is not a recipe, set is_recipe to false."""


def structure_recipe(title, description, transcript):
    user = (
        f"Video title: {title}\n\n"
        f"Description:\n{description}\n\n"
        f"Transcript:\n{transcript}"
    )
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=SYSTEM,
        tools=[{
            "name": "save_recipe",
            "description": "Save the extracted recipe",
            "input_schema": Recipe.model_json_schema(),
        }],
        tool_choice={"type": "tool", "name": "save_recipe"},
        messages=[{"role": "user", "content": user}],
    )
    block = next(b for b in response.content if b.type == "tool_use")
    return Recipe.model_validate(block.input)


if __name__ == "__main__":
    data = get_transcript(sys.argv[1], "--whisper" in sys.argv)
    print(f"Source: {data['source']}\n")
    recipe = structure_recipe(data["title"], data["description"], data["transcript"])
    print(json.dumps(recipe.model_dump(), indent=2, ensure_ascii=False))