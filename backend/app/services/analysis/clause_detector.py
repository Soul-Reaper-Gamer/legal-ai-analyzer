import re

def detect_clauses(text):

    clauses = []

    patterns = {
        "payment": r"payment|rent|fee",
        "termination": r"terminate|termination|cancel",
        "liability": r"liability|responsible|damage",
        "deposit": r"deposit|security deposit",
        "confidentiality": r"confidential|non disclosure"
    }

    sentences = re.split(r"[.]", text)

    for sentence in sentences:

        for clause_type, pattern in patterns.items():

            if re.search(pattern, sentence, re.IGNORECASE):

                clauses.append({
                    "type": clause_type,
                    "text": sentence.strip()
                })

    return clauses