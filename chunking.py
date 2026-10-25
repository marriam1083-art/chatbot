from typing import List, Dict

def split_text_into_chunks(text: str, chunk_size: int = 500, chunk_overlap: int = 80) -> List[str]:
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 2 <= chunk_size:
            current_chunk = f"{current_chunk}\n\n{paragraph}".strip()
        else:
            if current_chunk:
                chunks.append(current_chunk)
            if len(paragraph) > chunk_size:
                start = 0
                while start < len(paragraph):
                    end = start + chunk_size
                    chunks.append(paragraph[start:end])
                    start += chunk_size - chunk_overlap
                current_chunk = ""
            else:
                current_chunk = paragraph

    if current_chunk:
        chunks.append(current_chunk)

    return chunks

def chunk_documents(documents: List[Dict[str, str]], chunk_size: int, chunk_overlap: int) -> List[Dict[str, str]]:
    chunked_docs = []
    for doc in documents:
        chunks = split_text_into_chunks(doc["content"], chunk_size, chunk_overlap)
        for idx, chunk in enumerate(chunks):
            chunked_docs.append({
                "source": doc["source"],
                "chunk_id": f"{doc['source']}_chunk_{idx}",
                "text": chunk
            })
    return chunked_docs