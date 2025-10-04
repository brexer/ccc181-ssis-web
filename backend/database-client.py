import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv load load_dotenv

load_dotenv()

def get_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        pass=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    return conn