from app.embeddings import generate_embedding
from app.qdrant_db import search_similar_chunks

def retrieve_relevant_context(question: str, top_k: int = 4) -> list[dict]:
    query_vector = generate_embedding(question)
    return search_similar_chunks(query_vector, top_k=top_k)