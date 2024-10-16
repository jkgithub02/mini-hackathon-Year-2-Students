import os
import openai
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
import faiss, pickle
import numpy as np
from langchain.docstore.document import Document
from langchain.vectorstores import FAISS

def ask_open_ai(query):
    config = {
        "api_type": os.getenv("AZURE_OPENAI_API_TYPE"),
        "api_base": os.getenv("AZURE_OPENAI_API_BASE"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION"),
        "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
        "deployment_name": os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        "model_name": os.getenv("AZURE_OPENAI_MODEL"),
    }

    AZURE_OPENAI_API_KEY = config["api_key"]
    AZURE_OPENAI_ENDPOINT = config["api_base"]
    AZURE_OPENAI_DEPLOYMENT_NAME = "text-embedding-ada-002"

    openai.api_type = config["api_type"]
    openai.api_key = config["api_key"]
    openai.api_base = config["api_base"]
    openai.api_version = config["api_version"]

    embeddings = AzureOpenAIEmbeddings(
        openai_api_key=AZURE_OPENAI_API_KEY,
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        openai_api_version=config["api_version"],
        deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
        openai_api_type=config["api_type"],
    )

    VECTOR_STORE_INDEX = os.getenv("VECTOR_STORE_INDEX")
    VECTOR_STORE_METADATA = os.getenv("VECTOR_STORE_METADATA")

    index = faiss.read_index(VECTOR_STORE_INDEX)
    if faiss.get_num_gpus() > 0:
        res = faiss.StandardGpuResources()
        index = faiss.index_cpu_to_gpu(res, 0, index)
    with open(VECTOR_STORE_METADATA, "rb") as f:
        metadata = pickle.load(f)
    
    documents = [Document(page_content=text, metadata={}) for text in metadata]

    vector_store = FAISS.from_documents(documents=documents, embedding=embeddings)

    llm = AzureChatOpenAI(
        deployment_name=config["deployment_name"],
        model_name=config["model_name"],
        azure_endpoint=config["api_base"],
        openai_api_key=config["api_key"],
        openai_api_version=config["api_version"],
        openai_api_type=config["api_type"],
        temperature=0.1,
        max_tokens=150,
    )

    system_prompt = (
    '''
    Answer the financial questions based solely on the context below:

    <context>

    {context}

    </context>
    '''
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    chain = create_retrieval_chain(vector_store.as_retriever(), question_answer_chain)

    result = chain.invoke({"input": query})

    return result['answer']