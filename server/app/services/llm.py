from typing import Optional, List
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.core.logger import logger

DEFAULT_SYSTEM_PROMPT = """You are a helpful AI assistant.

Use ONLY the provided context to answer the question.

If the answer is not present in the context,
say: "I could not find the answer in the document."
"""

DEFAULT_HUMAN_TEMPLATE = """Context:
{context}

Question:
{question}
"""

def get_prompt_template(system_prompt: Optional[str] = None) -> ChatPromptTemplate:
    sys_content = system_prompt.strip() if system_prompt else DEFAULT_SYSTEM_PROMPT
    return ChatPromptTemplate.from_messages([
        ("system", sys_content),
        ("human", DEFAULT_HUMAN_TEMPLATE)
    ])

def get_llm(model: Optional[str] = None) -> ChatGroq:
    """
    Instantiates ChatGroq with requested model or configured default.
    """
    selected_model = model or settings.DEFAULT_LLM_MODEL
    logger.info(f"Instantiating ChatGroq with model: {selected_model}")
    return ChatGroq(
        model=selected_model,
        groq_api_key=settings.GROQ_API_KEY
    )

def generate_rag_answer(context: str, question: str, model: Optional[str] = None, system_prompt: Optional[str] = None) -> tuple[str, str]:
    """
    Generates an answer using the provided context and question.
    Returns (answer_text, model_name_used).
    """
    candidate_models = [model] if model else [settings.DEFAULT_LLM_MODEL] + settings.FALLBACK_LLM_MODELS
    last_error = None
    
    prompt = get_prompt_template(system_prompt)
    formatted_prompt = prompt.invoke({
        "context": context,
        "question": question
    })

    for m in candidate_models:
        if not m:
            continue
        try:
            llm = get_llm(m)
            response = llm.invoke(formatted_prompt)
            return response.content, m
        except Exception as e:
            logger.warning(f"Failed to generate answer with model {m}: {e}")
            last_error = e

    raise RuntimeError(f"All LLM generation attempts failed: {last_error}")
