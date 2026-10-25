from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from app.config import settings

def get_qdrant_client() -> QdrantClient:
    if not settings.QDRANT_URL.startswith("http"):
        return QdrantClient(path="./qdrant_local_db", check_compatibility=False)
        
    if settings.QDRANT_API_KEY:
        return QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, check_compatibility=False)
    return QdrantClient(url=settings.QDRANT_URL, check_compatibility=False)

def ensure_collection_exists(vector_size: int = 768):
    client = get_qdrant_client()
    try:
        collections = [col.name for col in client.get_collections().collections]
    except Exception:
        collections = []
        
    if settings.QDRANT_COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
        )

def upsert_chunks(chunks_with_vectors: list[dict]):
    client = get_qdrant_client()
    points = [
        PointStruct(
            id=idx,
            vector=item["vector"],
            payload={"source": item["source"], "text": item["text"]}
        )
        for idx, item in enumerate(chunks_with_vectors)
    ]
    client.upsert(collection_name=settings.QDRANT_COLLECTION_NAME, points=points)

def search_similar_chunks(query_vector: list[float], top_k: int = 4) -> list[dict]:
    client = get_qdrant_client()
    # Updated to use query_points for newer qdrant-client compatibility
    results = client.query_points(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        query=query_vector,
        limit=top_k
    ).points
    
    return [
        {
            "source": hit.payload.get("source", "Unknown"),
            "text": hit.payload.get("text", ""),
            "score": round(hit.score, 4)
        }
        for hit in results
    ]