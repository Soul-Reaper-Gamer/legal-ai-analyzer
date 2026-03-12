from fastapi import APIRouter
from pydantic import BaseModel

# reuse Groq client from analysis
from app.services.analysis import client

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    contract_text: str


@router.post("/chat")
async def chat_with_contract(data: ChatRequest):

    contract_text = data.contract_text[:12000]

    system_prompt = """
You are an expert AI Legal Contract Assistant.

Your job is to help users understand contracts, detect risks,
and suggest negotiation improvements.

You must behave like a professional contract advisor.

CORE RESPONSIBILITIES

1. Explain clauses in simple language
2. Identify legal or financial risks
3. Suggest safer alternatives
4. Recommend negotiation strategies
5. Help the user understand obligations

ANALYSIS GUIDELINES

When answering:

• If the user asks about a clause → explain the clause and risks
• If the user asks about risk → identify risk and why it matters
• If the user asks about fairness → evaluate whether the clause favors one side
• If the user asks what the contract is about → summarize the agreement
• If the user asks how to negotiate → suggest improvements and safer wording

NEGOTIATION SUPPORT

When possible, provide:

- Why the clause is risky
- What the user should negotiate
- Example improved clause wording

Example:

Risk:
The clause allows unilateral termination.

Negotiation Suggestion:
Request a 30-day written notice before termination.

Safer Clause Example:
"Either party may terminate this agreement with a minimum
30-day written notice."

IMPORTANT RULES

• Base answers ONLY on the provided contract text
• Do NOT invent clauses not present in the document
• Keep explanations clear and concise
• Avoid complex legal jargon
• Focus on helping the user make better decisions
"""

    user_prompt = f"""
CONTRACT DOCUMENT
-----------------
{contract_text}

USER QUESTION
-------------
{data.question}

INSTRUCTIONS

1. Analyze the contract text.
2. Identify the relevant section if possible.
3. Explain the answer clearly.
4. If a risk exists, explain it.
5. Provide negotiation advice if applicable.

FORMAT YOUR RESPONSE LIKE THIS:

Explanation:
(plain English explanation)

Risk (if any):
(short risk explanation)

Negotiation Tip (if applicable):
(how the user can negotiate)

Safer Alternative (if possible):
(example improved clause)

Answer:
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.2,
        max_tokens=700
    )

    answer = completion.choices[0].message.content

    return {"answer": answer}
