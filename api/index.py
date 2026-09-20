from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "Healthcare Analytics API is running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "success": True,
        "status": "connected"
    })