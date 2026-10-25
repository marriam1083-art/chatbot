# CodeLore System Architecture Overview

## 1. Core Services
- **FastAPI Service**: Handles HTTP requests, CORS middleware, token validations, and RAG orchestrations. Runs asynchronously on port 8000.
- **Qdrant Vector Database**: Stores embedding vectors of size 768 using Cosine similarity metric. Can run locally via Docker (`http://localhost:6333`) or via Qdrant Cloud.
- **Gemini Embeddings Engine**: Utilizes Google's embedding model to vectorize documentation chunks and user queries.
- **Groq Generation Engine**: Synthesizes human-like technical answers using exclusively retrieved context chunks.

## 2. Ingestion Pipeline
The document ingestion sequence operates as follows:
1. Loads all `.md` files from the `backend/data/` directory.
2. Splits documents into overlapping text blocks via paragraph-aware chunking (`CHUNK_SIZE=500`, `CHUNK_OVERLAP=80`).
3. Batch generates embedding vectors using the Gemini API.
4. Upserts text chunks together with vector arrays and file payload metadata into Qdrant.