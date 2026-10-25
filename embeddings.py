from google import genai
from app.config import settings

def get_gemini_client():
    return genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text: str) -> list[float]:
    client = get_gemini_client()
    response = client.models.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        contents=text
    )
    return response.embeddings[0].values

def generate_batch_embeddings(texts: list[str]) -> list[list[float]]:
    return [generate_embedding(text) for text in texts]