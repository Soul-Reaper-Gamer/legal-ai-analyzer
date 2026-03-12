import pytesseract
from PIL import Image
import io
import os

pytesseract.pytesseract.tesseract_cmd = os.getenv(
    "TESSERACT_PATH",
    r"D:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_text_from_image(image_bytes):

    try:

        image = Image.open(io.BytesIO(image_bytes))

        image = image.convert("L")

        text = pytesseract.image_to_string(image, lang="eng")

        return text

    except Exception as e:
        print("OCR extraction error:", e)
        return ""