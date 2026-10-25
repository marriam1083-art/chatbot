from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.retriever import retrieve_relevant_context
from app.generator import generate_answer
from app.ingest import run_ingestion

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

class SourceItem(BaseModel):
    source: str
    text: str
    score: float

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceItem]

@router.get("/health")
def health_check():
    return {"status": "online", "service": "CodeLore RAG Engine"}

@router.post("/ingest")
def trigger_ingestion():
    try:
        stats = run_ingestion()
        return {"status": "success", "details": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    try:
        context_chunks = retrieve_relevant_context(request.question)
        answer = generate_answer(request.question, context_chunks)
        return ChatResponse(
            answer=answer,
            sources=[SourceItem(**c) for c in context_chunks]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")