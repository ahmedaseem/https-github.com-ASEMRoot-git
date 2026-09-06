# test_api.py
import os
from dotenv import load_dotenv
import openai
import time

load_dotenv()
openai.api_key = os.environ["OPENAI_API_KEY"]

prompt = "Say hi in a friendly sentence." https://api.openai.com/v1/chat/completions

t0 = time.time()
resp = openai.ChatCompletion.create(
    model="gpt-4o",                   # replace with the model your account can access
    messages=[{"role":"user","content":prompt}],
    max_tokens=60,
    temperature=0.5
)
elapsed = time.time() - t0
print("Response:", resp["choices"][0]["message"]["content"])
print("Latency (s):", elapsed)
