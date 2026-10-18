import json
import os
import sys

import anthropic
from pydantic import BaseModel, Field

from app.transcribe import get_transcript

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
MODEL = os.getenv("LLM_MODEL", "claude-haiku-5-5")


class Ingredient(BaseModel):
    name: str = Field(
        description="The ingredient only, lowercase, no preparation words. "
        "E.g. 'butter', not 'butter, melted'."
    )
    quantity: str | None = Field(
        None,
        description="The number only, as written. E.g. '1 1/3', '2', '0.5'. "
        "Never include units or words. Null if not stated.",
    )
    unit: str | None = Field(
        None,
        description="The unit only, singular or plural as spoken. "
        "E.g. 'cups', 'tablespoon', 'g'. Null for countable items like '1 egg'.",
    )
    note: str | None = Field(
        None,
        description="Preparation, alternative measurements, or purpose. "
        "E.g. 'melted', '160g', 'for serving'.",
    )

class Step(BaseModel):
    text: str = Field(description="Short, imperative instruction.")
    timer_seconds: int | None = Field(
        None,
        description="Only if the step involves waiting a stated or clearly "
        "implied duration (bake, simmer, rest, chill, boil). For a range like "
        "'10-12 minutes', use the lower bound. Null for steps without a "
        "duration, or ones that end on a visual cue like 'until golden'.",
    )
    timer_label: str | None = Field(
        None,
        description="2-3 word label for the timer, e.g. 'Rest dough', "
        "'Bake brownies'. Null if there is no timer.",
    )

class Recipe(BaseModel):
    is_recipe: bool
    title: str
    servings: int | None = Field(
        None,
        description="Number of servings. If not stated, estimate from the "
        "batch size (e.g. 8 pancakes is about 3-4 servings).",
    )
    total_time_minutes: int | None = Field(
        None,
        description="Total prep plus cooking time in minutes. If not stated, "
        "estimate from the steps.",
    )
    ingredients: list[Ingredient]
    steps: list[Step]


SYSTEM = """You extract recipes from cooking video transcripts and descriptions.

Rules:
- Never invent ingredient amounts. If an amount isn't stated, leave quantity and unit null.
- If the description lists exact amounts, prefer them over the transcript.
- Split every amount into quantity (number only) and unit (unit only).
- Put preparation ("melted", "sifted"), alternative measurements ("160g"),
  and purpose ("for serving", "for greasing") in note, not in name.
- If the same ingredient is used in several places, list it once per use
  with a note explaining which use.
- Servings and total time may be estimated when not stated.
- Write everything in English.
- Steps are short, imperative, and in order. Add a timer only when a step
  has a real waiting time; "cook until bubbles form" gets no timer.
- If the content is not a recipe, set is_recipe to false.

Example ingredient conversions:
"1 1/3 cups (160g) all-purpose flour, sifted"
  -> name: "all-purpose flour", quantity: "1 1/3", unit: "cups", note: "160g, sifted"
"4 tablespoons butter, melted"
  -> name: "butter", quantity: "4", unit: "tablespoons", note: "melted"
"1 egg"
  -> name: "egg", quantity: "1", unit: null, note: null
"salt to taste"
  -> name: "salt", quantity: null, unit: null, note: "to taste"
"""


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