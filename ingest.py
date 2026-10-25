from app.document_loader import load_markdown_documents
from app.chunking import chunk_documents
from app.embeddings import generate_batch_embeddings
from app.qdrant_db import ensure_collection_exists, upsert_chunks
from app.config import settings

def run_ingestion() -> dict:
    docs = load_markdown_documents()
    chunks = chunk_documents(docs, settings.CHUNK_SIZE, settings.CHUNK_OVERLAP)
    
    texts = [c["text"] for c in chunks]
    vectors = generate_batch_embeddings(texts)
    
    if vectors:
        ensure_collection_exists(vector_size=len(vectors[0]))
    
    chunks_with_vectors = []
    for c, v in zip(chunks, vectors):
        chunks_with_vectors.append({
            "source": c["source"],
            "text": c["text"],
            "vector": v
        })
    
    upsert_chunks(chunks_with_vectors)
    return {
        "documents_processed": len(docs),
        "chunks_processed": len(chunks),
        "vectors_stored": len(vectors)
    }