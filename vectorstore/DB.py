from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from langchain_core.documents import Document

load_dotenv()

docs = [
    Document(page_content="Python is widely used in Artificial Intelligence.", metadata={"topic": "Python"}),
    Document(page_content="Pandas is used for data analysis in Python.", metadata={"topic": "Pandas"}),
    Document(page_content="Neural networks are used in deep learning.", metadata={"topic": "Deep Learning"})
]

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="chromadb",
)

result = vectorstore.similarity_search(
    "What is Python used for?",
    k=2
)
retriver = vectorstore.as_retriever(search_kwargs={"k": 2})
docs=retriver.invoke("What is Python used for?")

for doc in result:
    print(doc.page_content)
    print(doc.metadata)

for doc in docs:
    print(doc.page_content)
    print(doc.metadata)