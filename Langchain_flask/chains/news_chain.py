from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI  # or use your Gemini integration
from langchain.chains import LLMChain
import os

with open("prompts/news_prompt.txt") as f:
    prompt_template = f.read()

prompt = PromptTemplate(
    input_variables=["article"],
    template=prompt_template
)

llm = OpenAI(temperature=0.3)

news_chain = LLMChain(prompt=prompt, llm=llm)

def analyze_news(article):
    response = news_chain.run(article=article)
    return response
