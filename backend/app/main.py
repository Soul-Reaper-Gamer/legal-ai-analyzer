from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.upload import router as upload_router


app = FastAPI(
    title="Legal AI Contract Analyzer",
    description="AI-powered legal document risk analyzer using OCR + LLM",
    version="1.0.0"
)

# Enable CORS so frontend (Next.js / Vercel) can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://legal-ai-analyzer.vercel.app"
    ],
    # Allow all Vercel preview deployments
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Document upload / analysis routes
app.include_router(
    upload_router,
    prefix="/api",
    tags=["Document Analysis"]
)

# Chat AI routes
app.include_router(
    chat_router,
    prefix="/api",
    tags=["Chat"]
)

# Root endpoint
@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Legal AI Backend Running 🚀"
    }

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "legal-ai-backend"
    }