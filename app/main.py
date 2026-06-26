from fastapi import FastAPI
from app.routes import reportes_router

app = FastAPI(title="My Modular API")

app.include_router(reportes_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
