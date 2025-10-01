import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

#debug
print("URL: ", SUPABASE_URL)
print("KEY: ", SUPABASE_SERVICE_KEY)