from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter


loader = TextLoader("documentsloaders/notes.txt")

splitter = CharacterTextSplitter(
    separator=".",
    chunk_size=100,
    chunk_overlap=0,
)

docs = loader.load()

chunks = splitter.split_documents(docs)

print(len(chunks))