def calculate_risk_score(clauses):

    risk = {
        "financial": 0,
        "liability": 0,
        "termination": 0,
        "privacy": 0
    }

    for clause in clauses:

        if clause["type"] == "deposit":
            risk["financial"] += 20

        if clause["type"] == "liability":
            risk["liability"] += 30

        if clause["type"] == "termination":
            risk["termination"] += 25

        if clause["type"] == "confidentiality":
            risk["privacy"] += 10

    total = sum(risk.values())

    return {
        "total_risk": min(total, 100),
        "breakdown": risk
    }