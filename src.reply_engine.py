from .language_detector import detector


MESSAGES = {

    "ar": "تم اكتشاف اللغة العربية",

    "en": "English language detected",

    "fr": "Langue française détectée",

    "de": "Deutsche Sprache erkannt",

    "es": "Idioma español detectado"

}


def build_reply(text):

    result = detector.detect(text)

    lang = result["language"]
    conf = result["confidence"]

    if lang == "unknown":
        return (
            "لغة غير معروفة "
            f"(confidence={conf:.2%})"
        )

    message = MESSAGES.get(
        lang,
        "Language detected"
    )

    return (
        f"{message}\n"
        f"Code: {lang}\n"
        f"Confidence: {conf:.2%}"
    )
