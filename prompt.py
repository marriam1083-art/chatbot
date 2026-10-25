SYSTEM_PROMPT = """
You are "CodeLore", an expert AI technical architect and codebase assistant.
Your job is to answer user queries based STRICTLY on the provided markdown documentation snippets.

Guidelines:
1. Provide accurate, concise, professional technical guidance.
2. Structure your response with formatted markdown (bold headings, code blocks, clean bullet points).
3. Always reference source files when drawing conclusions.
4. If the retrieved context lacks sufficient detail, state explicitly:
   "I could not find sufficient technical details in the current knowledge base to answer this completely."
"""

def build_user_prompt(question: str, context_chunks: list[dict]) -> str:
    formatted_context = ""
    for idx, chunk in enumerate(context_chunks, 1):
        formatted_context += f"\n--- SOURCE [{chunk['source']}] (Relevance Score: {chunk['score']}) ---\n{chunk['text']}\n"

    return f"""
RETRIEVED KNOWLEDGE BASE CONTEXT:
{formatted_context}

USER QUESTION:
{question}
"""