import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

from app.services.fairness_engine import fairness_analysis

from app.services.negotiation_engine import (
    negotiation_suggestions,
    negotiation_strategy,
    negotiation_strength_score
)

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ---------------------------
# JSON EXTRACTION
# ---------------------------

def extract_json(text: str):

    try:
        text = text.replace("```json", "").replace("```", "").strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)

        if match:
            return json.loads(match.group())

        return None

    except Exception as e:
        print("JSON extraction error:", e)
        return None


# ---------------------------
# NORMALIZE RISK VALUES
# ---------------------------

def normalize_risk_overview(risk):

    default = {
        "financial_risk": 0,
        "liability_risk": 0,
        "termination_risk": 0,
        "privacy_risk": 0
    }

    normalized = {}

    for key in default:

        value = risk.get(key, 0)

        try:
            value = int(value)
        except:
            value = 0

        value = max(0, min(100, value))

        normalized[key] = value

    return normalized


# ---------------------------
# IMPROVED RISK ENGINE
# ---------------------------

def calculate_dynamic_risk(clauses, red_flags):

    score_map = {
        "Low": 25,
        "Medium": 55,
        "High": 85
    }

    financial = 10
    liability = 10
    termination = 10
    privacy = 10

    for c in clauses:

        level = c.get("risk_level", "Low")
        score = score_map.get(level, 25)

        text = c.get("clause_text", "").lower()
        ctype = c.get("clause_type", "").lower()

        if "payment" in text or "fee" in text or "financial" in ctype:
            financial += score

        if "liability" in text or "indemnity" in text or "damages" in text:
            liability += score

        if "terminate" in text or "termination" in text or "cancel" in text:
            termination += score

        if "data" in text or "privacy" in text or "information" in text:
            privacy += score

    # red flags increase risk significantly
    red_flag_bonus = len(red_flags) * 15

    financial += red_flag_bonus
    liability += red_flag_bonus
    termination += red_flag_bonus
    privacy += red_flag_bonus

    clause_count = max(len(clauses), 1)

    financial = int(financial / clause_count)
    liability = int(liability / clause_count)
    termination = int(termination / clause_count)
    privacy = int(privacy / clause_count)

    return normalize_risk_overview({
        "financial_risk": financial,
        "liability_risk": liability,
        "termination_risk": termination,
        "privacy_risk": privacy
    })


# ---------------------------
# MAIN ANALYSIS FUNCTION
# ---------------------------

def analyze_contract(text: str):

    contract_text = text[:12000]

    prompt = f"""
You are an expert AI Legal Contract Risk Analyzer.

Analyze the contract and detect risks.

RULES

1. Extract exact clauses from the contract.
2. Do NOT invent clauses.
3. Clauses must be 1–2 sentences.
4. Return STRICT JSON only.

-----------------------------------------------------

TASK 1 — RISK SCORING

Estimate contract risks from 0–100.

Financial Risk
Liability Risk
Termination Risk
Privacy Risk

-----------------------------------------------------

TASK 2 — KEY INSIGHTS

Explain the contract in SIMPLE language.

Rules:
• 3–5 insights
• one sentence each
• easy to understand

-----------------------------------------------------

TASK 3 — CLAUSE DETECTION

Return 8–10 clauses if possible.

For each clause return:

clause_text
clause_type
risk_level (Low / Medium / High)
risk_reason
suggestion

-----------------------------------------------------

TASK 4 — RED FLAGS

Detect:

• unlimited liability
• unilateral termination
• excessive penalties
• ownership transfer
• hidden fees

-----------------------------------------------------

TASK 5 — FAIRNESS SCORE

100 = balanced  
70–90 = normal  
40–70 = risky  
0–40 = highly unfair

-----------------------------------------------------

RETURN STRICT JSON

FORMAT

{{
"risk_overview": {{
"financial_risk": 0,
"liability_risk": 0,
"termination_risk": 0,
"privacy_risk": 0
}},
"insights": [],
"clauses": [],
"red_flags": [],
"fairness_score": 0
}}

CONTRACT TEXT

{contract_text}
"""

    try:

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )

        response_text = completion.choices[0].message.content

        parsed = extract_json(response_text)

        if not parsed:
            return {
                "error": "AI returned invalid JSON",
                "raw_response": response_text
            }

        clauses = parsed.get("clauses", [])
        red_flags = parsed.get("red_flags", [])

        # ---------------------------
        # IMPROVED RISK ENGINE
        # ---------------------------

        parsed["risk_overview"] = calculate_dynamic_risk(
            clauses,
            red_flags
        )

        # ---------------------------
        # FAIRNESS
        # ---------------------------

        parsed["fairness"] = fairness_analysis(clauses)

        # ---------------------------
        # NEGOTIATION ENGINE
        # ---------------------------

        parsed["negotiation"] = {
            "strength_score": negotiation_strength_score(clauses),
            "suggestions": negotiation_suggestions(clauses),
            "strategy": negotiation_strategy(clauses)
        }

        return parsed

    except Exception as e:
        return {"error": str(e)}
