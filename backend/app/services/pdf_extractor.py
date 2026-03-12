import fitz
from app.services.ocr_extractor import extract_text_from_image


def extract_text_from_pdf(pdf_path: str):

    full_text = ""

    try:

        doc = fitz.open(pdf_path)

        for page_number, page in enumerate(doc, start=1):

            text = page.get_text("text")

            if text.strip():

                full_text += f"\n\n--- Page {page_number} ---\n"
                full_text += text

            else:

                images = page.get_images(full=True)

                for img in images:

                    try:

                        xref = img[0]

                        base_image = doc.extract_image(xref)

                        image_bytes = base_image["image"]

                        ocr_text = extract_text_from_image(image_bytes)

                        if ocr_text:

                            full_text += f"\n\n--- Page {page_number} OCR ---\n"
                            full_text += ocr_text

                    except Exception as img_error:
                        print("OCR error:", img_error)

        doc.close()

    except Exception as e:
        print("PDF extraction error:", e)

    return full_text.strip()