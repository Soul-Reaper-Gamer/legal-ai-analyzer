from fastapi import APIRouter, UploadFile, File
import shutil
import os
import uuid

from app.services.pdf_extractor import extract_text_from_pdf
from app.services.analysis import analyze_contract

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):

    allowed_extensions = (".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg")

    if not file.filename.lower().endswith(allowed_extensions):
        return {"error": "Unsupported file type"}

    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]

    file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}{file_extension}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)

    if not text:
        return {"error": "Could not extract text"}

    result = analyze_contract(text)

    return {
        "analysis": result,
        "contract_text": text
    }