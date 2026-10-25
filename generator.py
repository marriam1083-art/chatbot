from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_answer(question: str, context_chunks: list[dict]) -> str:
    # Format context from retrieved chunks
    context_text = "\n\n".join([f"Source ({chunk['source']}):\n{chunk['text']}" for chunk in context_chunks])
    system_prompt = f"""You are CodeLore, an expert AI assistant. Use the provided context or your general knowledge to answer the user accurately.

RULES:
1. NEVER use LaTeX symbols, backslashes, math blocks like \[ \], \( \), \frac, \pm, \sqrt, or \boxed. Write math in simple plain text (e.g., x = (-b ± sqrt(b^2 - 4ac)) / (2a)).
2. Keep answers exceptionally clean, structured, and human-understandable using bullet points or numbered lists.

Context:
{context_text}"""

    response = client.chat.completions.create(
        model=settings.GROQ_GENERATION_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        temperature=0.3,
        max_tokens=1024
    )
    
    return response.choices[0].message.content