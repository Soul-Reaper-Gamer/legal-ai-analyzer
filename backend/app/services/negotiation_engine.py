def negotiation_suggestions(clauses):

    results = []

    for clause in clauses:

        text = clause.get("clause_text", "").lower()

        tip = "Review and negotiate balanced wording."
        alt = "Modify the clause to ensure mutual obligations."
        strength = "Low"

        if "terminate" in text or "termination" in text:

            tip = "Request a minimum notice period before termination."
            alt = "Either party may terminate this agreement with a 30-day written notice."
            strength = "Medium"

        elif "liability" in text:

            tip = "Add a liability cap to prevent unlimited exposure."
            alt = "Liability shall not exceed the total contract value."
            strength = "High"

        elif "data" in text or "privacy" in text:

            tip = "Restrict how the company can use personal data."
            alt = "User data may only be used for providing the service and cannot be shared without consent."
            strength = "Medium"

        elif "payment" in text:

            tip = "Clarify payment schedule and penalties."
            alt = "Payments must be completed within 30 days of invoice."
            strength = "High"

        results.append({
            "clause": clause.get("clause_text", ""),
            "negotiation_tip": tip,
            "alternative_clause": alt,
            "strength": strength
        })

    return results


def negotiation_strategy(clauses):

    strategy = {
        "high_priority": [],
        "medium_priority": [],
        "low_priority": []
    }

    for clause in clauses:

        level = clause.get("risk_level", "Low")
        text = clause.get("clause_text", "")

        if level == "High":
            strategy["high_priority"].append(text)

        elif level == "Medium":
            strategy["medium_priority"].append(text)

        else:
            strategy["low_priority"].append(text)

    return strategy


def negotiation_strength_score(clauses):

    score_map = {
        "Low": 20,
        "Medium": 50,
        "High": 80
    }

    total = 0

    for clause in clauses:
        level = clause.get("risk_level", "Low")
        total += score_map.get(level, 20)

    if not clauses:
        return 0

    avg_risk = total / len(clauses)

    strength = 100 - avg_risk

    return round(strength)
