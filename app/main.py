from fastapi import FastAPI
from app.routes import reportes_router
from os import getenv
from dotenv import load_dotenv
from mssql_python import connect

load_dotenv()
conn = connect(getenv("SQL_CONNECTION_STRING"))

app = FastAPI(title="My Modular API")

app.include_router(reportes_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
