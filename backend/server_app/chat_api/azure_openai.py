import os
import openai
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

def ask_open_ai(query):
    config = {
        "api_type": os.getenv("AZURE_OPENAI_API_TYPE"),
        "api_base": os.getenv("AZURE_OPENAI_API_BASE"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION"),
        "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
        "deployment_name": os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        "model_name": os.getenv("AZURE_OPENAI_MODEL"),
    }

    openai.api_type = config["api_type"]
    openai.api_key = config["api_key"]
    openai.api_base = config["api_base"]
    openai.api_version = config["api_version"]

    # Initialize the Azure OpenAI LLM
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

    # Define system and human message templates
    system_message = SystemMessagePromptTemplate.from_template(
        "You are a helpful assistant that provides concise and accurate answers to user queries."
    )
    human_message = HumanMessagePromptTemplate.from_template("{input}")

    # Combine into a chat prompt template
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

    # Initialize LLMChain with the chat prompt
    chain = chat_prompt | llm

    # Get the response from the chain
    response = chain.invoke(input=query)

    return response.content  # Return the content of the response