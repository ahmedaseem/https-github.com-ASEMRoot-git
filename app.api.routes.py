@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "ASEM API"
    }), 200

