from fastapi import FastAPI
from app.routes import reportes_router
from app.routes import huespedes_router
from app.routes import reservas_router
from app.routes import espacios_router
from app.routes import proveedores_router
from app.routes import mantenimientos_router
from app.routes import productos_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My Modular API")

origins = [
#"https://fluffy-barnacle-rv579j5wxrfx6jp-3000.app.github.dev",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reservas_router)
app.include_router(reportes_router)
app.include_router(huespedes_router)
app.include_router(reservas_router)
app.include_router(espacios_router)
app.include_router(mantenimientos_router)
app.include_router(proveedores_router)
app.include_router(productos_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}