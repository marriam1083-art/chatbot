import os
from typing import List, Dict

def load_markdown_documents(data_dir: str = "data") -> List[Dict[str, str]]:
    """Loads all Markdown (.md) documents from the target directory."""
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Data directory '{data_dir}' not found.")
    
    documents = []
    for filename in os.listdir(data_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(data_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    documents.append({
                        "source": filename,
                        "content": content
                    })
    if not documents:
        raise ValueError("No valid .md files found in data directory.")
    return documents