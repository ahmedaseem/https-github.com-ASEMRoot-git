import os
import fasttext

from .config import MODEL_PATH, MIN_CONFIDENCE


class LanguageDetector:

    def __init__(self):
        self.model = None

    def load(self):
        if self.model is None:
            if not os.path.exists(MODEL_PATH):
                raise FileNotFoundError(
                    f"Missing model: {MODEL_PATH}"
                )

            self.model = fasttext.load_model(MODEL_PATH)

    def detect(self, text: str):

        if not text or not text.strip():
            return {
                "language": "unknown",
                "confidence": 0.0
            }

        self.load()

        labels, probs = self.model.predict(
            text,
            k=1
        )

        lang = labels[0].replace(
            "__label__",
            ""
        )

        confidence = float(probs[0])

        if confidence < MIN_CONFIDENCE:
            lang = "unknown"

        return {
            "language": lang,
            "confidence": confidence
        }


detector = LanguageDetector()
