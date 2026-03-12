from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router #chat router
from app.routes.upload import router as upload_router

app = FastAPI(
    title="Legal AI Contract Analyzer",
    description="AI-powered legal document risk analyzer using OCR + LLM",
    version="1.0.0"
)

# Allow frontend (Next.js) to communicate with backend
origins = [
    "http://localhost:3000",   # Next.js frontend
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # safer than "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(
    upload_router,
    prefix="/api",
    tags=["Document Analysis"]
)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Legal AI Backend Running 🚀"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "legal-ai-backend"
    }
app.include_router(chat_router, prefix="/api", tags=["Chat"])