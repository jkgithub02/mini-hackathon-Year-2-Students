import os
import openai
from langchain_openai import AzureOpenAIEmbeddings

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

    '''
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
    '''

    return config["api_type"]