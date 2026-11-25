from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import TokenTextSplitter
loader = PyPDFLoader("documentsloaders/GRU.pdf")

docs = loader.load()
splitter = TokenTextSplitter(chunk_size=100, chunk_overlap=0)
chunks = splitter.split_documents(docs)
print(len(chunks[0].page_content))