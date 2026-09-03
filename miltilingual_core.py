import os
import sys

# إضافة مسار مكتبة fasttext لو محلية (اختياري)
# sys.path.append(os.path.join(os.path.dirname(__file__), "../libs/fasttext"))

import fasttext

# مسار النموذج
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "lid.176.ftz")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

# تحميل النموذج مرة واحدة
model = fasttext.load_model(MODEL_PATH)


def detect_lang(text: str) -> dict:
    """
    يكشف لغة النص ويرجع:
    - language: كود اللغة (مثلاً: ar, en, fr)
    - confidence: نسبة الثقة بين 0 و 1
    """
    if not text or not text.strip():
        return {
            "language": "unknown",
            "confidence": 0.0
        }

    labels, probs = model.predict(text)
    lang_code = labels[0].replace("__label__", "")
    confidence = float(probs[0])

    return {
        "language": lang_code,
        "confidence": confidence
    }


def build_reply(text: str) -> str:
    """
    يبني رد بسيط بناءً على اللغة المكتشفة.
    تقدر تطوّره لاحقًا لأي منطق عالمي.
    """
    info = detect_lang(text)
    lang = info["language"]
    conf = info["confidence"]

    if lang == "unknown":
        return "لم أستطع التعرف على اللغة."

    base_msg = f"تم التعرف على اللغة: {lang} بنسبة ثقة: {conf:.2f}"

    replies = {
        "ar": base_msg + " — الرد بالعربية.",
        "en": base_msg + " — replying in English.",
        "fr": base_msg + " — réponse en français.",
    }

    return replies.get(lang, base_msg + " — لا يوجد قالب رد مخصص لهذه اللغة حتى الآن.")
