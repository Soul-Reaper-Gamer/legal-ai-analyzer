import re


# -------------------------------
# Utility
# -------------------------------

def normalize(text):
    if not text:
        return ""
    return str(text).lower().strip()


# -------------------------------
# Party Detection
# -------------------------------

def detect_party_mentions(text):

    buyer = len(
        re.findall(r"\b(buyer|purchaser|party\s*a)\b", text, re.IGNORECASE)
    )

    vendor = len(
        re.findall(r"\b(vendor|seller|party\s*b)\b", text, re.IGNORECASE)
    )

    return buyer, vendor


# -------------------------------
# Penalty Bias
# -------------------------------

def penalty_bias(text):

    buyer_penalty = bool(
        re.search(
            r"(buyer|purchaser).*?(breach|penalty|forfeit|liable)",
            text,
            re.IGNORECASE
        )
    )

    vendor_penalty = bool(
        re.search(
            r"(vendor|seller).*?(breach|penalty|forfeit|liable)",
            text,
            re.IGNORECASE
        )
    )

    if buyer_penalty and not vendor_penalty:
        return "Buyer penalized but vendor not"

    if vendor_penalty and not buyer_penalty:
        return "Vendor penalized but buyer not"

    return None


# -------------------------------
# Termination Bias
# -------------------------------

def termination_bias(text):

    vendor_term = bool(
        re.search(r"(vendor|seller).*?terminate", text, re.IGNORECASE)
    )

    buyer_term = bool(
        re.search(r"(buyer|purchaser).*?terminate", text, re.IGNORECASE)
    )

    if vendor_term and not buyer_term:
        return "Vendor has termination power"

    if buyer_term and not vendor_term:
        return "Buyer has termination power"

    return None


# -------------------------------
# Liability Bias
# -------------------------------

def liability_bias(text):

    buyer_liability = bool(
        re.search(r"(buyer|purchaser).*?liable", text, re.IGNORECASE)
    )

    vendor_liability = bool(
        re.search(r"(vendor|seller).*?liable", text, re.IGNORECASE)
    )

    if buyer_liability and not vendor_liability:
        return "Buyer liability without vendor liability"

    if vendor_liability and not buyer_liability:
        return "Vendor liability without buyer liability"

    return None


# -------------------------------
# Dispute Clause
# -------------------------------

def dispute_clause_present(text):

    return bool(
        re.search(
            r"(arbitration|dispute|jurisdiction|court|mediation)",
            text,
            re.IGNORECASE
        )
    )


# -------------------------------
# Refund Bias
# -------------------------------

def refund_bias(text):

    buyer_refund = bool(
        re.search(r"(buyer|purchaser).*?refund", text, re.IGNORECASE)
    )

    vendor_refund = bool(
        re.search(r"(vendor|seller).*?refund", text, re.IGNORECASE)
    )

    if buyer_refund and not vendor_refund:
        return "Buyer refund protection only"

    if vendor_refund and not buyer_refund:
        return "Vendor refund protection only"

    return None


# -------------------------------
# Main Fairness Engine
# -------------------------------

def fairness_analysis(clauses):

    issues = []
    imbalance_score = 0

    buyer_mentions = 0
    vendor_mentions = 0
    dispute_found = False

    seen = set()

    for clause in clauses:

        # handle multiple clause formats
        raw_text = (
            clause.get("text")
            or clause.get("clause_text")
            or ""
        )

        text = normalize(raw_text)

        if not text:
            continue

        b, v = detect_party_mentions(text)

        buyer_mentions += b
        vendor_mentions += v

        if dispute_clause_present(text):
            dispute_found = True

        # Penalty
        penalty = penalty_bias(text)
        if penalty and "penalty" not in seen:

            issues.append({
                "type": "Penalty Imbalance",
                "description": penalty,
                "clause": raw_text[:150]
            })

            imbalance_score += 15
            seen.add("penalty")

        # Termination
        termination = termination_bias(text)
        if termination and "termination" not in seen:

            issues.append({
                "type": "Termination Power Imbalance",
                "description": termination,
                "clause": raw_text[:150]
            })

            imbalance_score += 15
            seen.add("termination")

        # Liability
        liability = liability_bias(text)
        if liability and "liability" not in seen:

            issues.append({
                "type": "Liability Imbalance",
                "description": liability,
                "clause": raw_text[:150]
            })

            imbalance_score += 12
            seen.add("liability")

        # Refund
        refund = refund_bias(text)
        if refund and "refund" not in seen:

            issues.append({
                "type": "Refund Protection Imbalance",
                "description": refund,
                "clause": raw_text[:150]
            })

            imbalance_score += 10
            seen.add("refund")

    # Party Power Imbalance
    if abs(buyer_mentions - vendor_mentions) > 6:

        issues.append({
            "type": "Party Power Imbalance",
            "description": f"Buyer mentions: {buyer_mentions}, Vendor mentions: {vendor_mentions}",
            "clause": "Contract language heavily favors one party"
        })

        imbalance_score += 10

    # Missing Dispute Clause
    if not dispute_found:

        issues.append({
            "type": "Missing Dispute Resolution",
            "description": "No arbitration or jurisdiction clause detected",
            "clause": "Contracts should define dispute resolution mechanisms"
        })

        imbalance_score += 12

    # prevent extreme scores
    imbalance_score = min(imbalance_score, 80)

    fairness_score = max(0, 100 - imbalance_score)

    if fairness_score >= 85:
        verdict = "Balanced"
    elif fairness_score >= 65:
        verdict = "Slightly Biased"
    elif fairness_score >= 40:
        verdict = "Moderately Unfair"
    else:
        verdict = "Highly Unfair"

    return {
        "fairness_score": fairness_score,
        "verdict": verdict,
        "issues": issues
    }
