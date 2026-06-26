from fastapi import FastAPI
from app.routes import reportes_router
from app.routes import huespedes_router
from app.routes import reservas_router
from app.routes import espacios_router
from app.routes import mantenimientos_router

app = FastAPI(title="My Modular API")

app.include_router(reportes_router)
app.include_router(huespedes_router)
app.include_router(reservas_router)
app.include_router(espacios_router)
app.include_router(mantenimientos_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}