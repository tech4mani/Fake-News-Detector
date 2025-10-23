def parse_analysis(response_text):
    is_fake = "false" in response_text.lower()
    confidence = 0.85  # TODO: extract from response
    return {
        "raw": response_text.strip(),
        "isFake": is_fake,
        "confidence": confidence
    }
