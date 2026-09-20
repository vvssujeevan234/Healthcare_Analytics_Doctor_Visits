import os
import sys

# ============================================================
# API DIRECTORY / IMPORT PATH
# ============================================================

API_DIR = os.path.dirname(os.path.abspath(__file__))

if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)


# ============================================================
# FLASK
# ============================================================

from flask import Flask, jsonify, request
from flask_cors import CORS


# ============================================================
# BACKEND MODULES
# ============================================================

from data_loader import (
    load_dataset,
    get_dataset_info,
    get_dataset_path
)

from analytics import (
    apply_filters,
    statistics,
    gender_distribution,
    age_distribution,
    visit_distribution,
    gender_average_visits,
    illness_vs_visits,
    illness_distribution,
    age_vs_visits,
    age_group_analysis,
    chronic_analysis,
    health_analysis,
    correlation_matrix,
    recent_records
)

from insights import (
    generate_insight,
    answer_question
)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():
    try:
        df = load_dataset()

        return jsonify({
            "success": True,
            "message": "Healthcare Analytics Flask API is running.",
            "dataset": get_dataset_path(),
            "rows": int(len(df)),
            "columns": int(len(df.columns))
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Healthcare Analytics Flask API is running, but the dataset could not be loaded.",
            "error": str(e)
        }), 500


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():

    try:
        df = load_dataset()

        return jsonify({
            "success": True,
            "status": "connected",
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "dataset": get_dataset_path()
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "status": "error",
            "error": str(e)
        }), 500


# ============================================================
# DATASET INFORMATION
# ============================================================

@app.route("/api/dataset", methods=["GET"])
def dataset():

    try:

        df = load_dataset()

        info = get_dataset_info()

        return jsonify({
            "success": True,
            "data": info,
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "path": get_dataset_path()
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================
# DASHBOARD
# ============================================================

@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    try:

        df = load_dataset()

        filtered_df = apply_filters(

            df,

            gender=request.args.get("gender"),

            age_group=request.args.get("age_group"),

            illness=request.args.get("illness"),

            health=request.args.get("health"),

            chronic=request.args.get("chronic"),

            private=request.args.get("private"),

            freepoor=request.args.get("freepoor"),

            freerepat=request.args.get("freerepat"),

            min_visits=request.args.get("min_visits"),

            max_visits=request.args.get("max_visits")
        )

        return jsonify({

            "success": True,

            "filter_count": int(len(filtered_df)),

            "statistics": statistics(filtered_df),

            "charts": {

                "gender":
                    gender_distribution(filtered_df),

                "age":
                    age_distribution(filtered_df),

                "visits":
                    visit_distribution(filtered_df),

                "gender_average":
                    gender_average_visits(filtered_df),

                "illness_visits":
                    illness_vs_visits(filtered_df),

                "illness_distribution":
                    illness_distribution(filtered_df),

                "age_visits":
                    age_vs_visits(filtered_df),

                "age_group":
                    age_group_analysis(filtered_df),

                "chronic":
                    chronic_analysis(filtered_df),

                "health":
                    health_analysis(filtered_df),

                "correlation":
                    correlation_matrix(filtered_df)
            },

            "insight":
                generate_insight(filtered_df),

            "records":
                recent_records(
                    filtered_df,
                    10
                )
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)
        }), 500


# ============================================================
# AI ASSISTANT
# ============================================================

@app.route(
    "/api/ask",
    methods=["POST"]
)
def ask():

    try:

        body = request.get_json(
            silent=True
        ) or {}

        question = body.get(
            "question",
            ""
        )

        if not question:

            return jsonify({

                "success": False,

                "answer": "Please enter a question."
            }), 400

        df = load_dataset()

        filtered_df = apply_filters(

            df,

            gender=body.get("gender"),

            age_group=body.get("age_group"),

            illness=body.get("illness"),

            health=body.get("health"),

            chronic=body.get("chronic"),

            private=body.get("private"),

            freepoor=body.get("freepoor"),

            freerepat=body.get("freerepat"),

            min_visits=body.get("min_visits"),

            max_visits=body.get("max_visits")
        )

        answer = answer_question(
            filtered_df,
            question
        )

        return jsonify({

            "success": True,

            "answer": answer,

            "filter_count": int(len(filtered_df))
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "answer":
                "Unable to process the question.",

            "error": str(e)

        }), 500


# ============================================================
# DATASET SUMMARY
# Useful for Data Understanding / Preprocessing pages
# ============================================================

@app.route(
    "/api/summary",
    methods=["GET"]
)
def summary():

    try:

        df = load_dataset()

        info = get_dataset_info()

        return jsonify({

            "success": True,

            "rows": int(len(df)),

            "columns": int(len(df.columns)),

            "column_names":
                list(df.columns),

            "dataset":
                info,

            "statistics":
                statistics(df)
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# RECENT RECORDS
# ============================================================

@app.route(
    "/api/records",
    methods=["GET"]
)
def records():

    try:

        df = load_dataset()

        limit = request.args.get(
            "limit",
            default=20,
            type=int
        )

        limit = max(
            1,
            min(limit, 100)
        )

        data = recent_records(
            df,
            limit
        )

        return jsonify({

            "success": True,

            "count": len(data),

            "records": data
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# ANALYSIS DATA
# ============================================================

@app.route(
    "/api/analysis",
    methods=["GET"]
)
def analysis():

    try:

        df = load_dataset()

        return jsonify({

            "success": True,

            "statistics":
                statistics(df),

            "gender":
                gender_distribution(df),

            "age":
                age_distribution(df),

            "visits":
                visit_distribution(df),

            "gender_average":
                gender_average_visits(df),

            "illness_visits":
                illness_vs_visits(df),

            "illness_distribution":
                illness_distribution(df),

            "age_visits":
                age_vs_visits(df),

            "age_group":
                age_group_analysis(df),

            "chronic":
                chronic_analysis(df),

            "health":
                health_analysis(df),

            "correlation":
                correlation_matrix(df),

            "insight":
                generate_insight(df)
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# INSIGHTS
# ============================================================

@app.route(
    "/api/insights",
    methods=["GET"]
)
def insights():

    try:

        df = load_dataset()

        return jsonify({

            "success": True,

            "insight":
                generate_insight(df),

            "statistics":
                statistics(df),

            "health":
                health_analysis(df),

            "chronic":
                chronic_analysis(df),

            "illness":
                illness_distribution(df),

            "age_group":
                age_group_analysis(df)
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# INSIGHTS QUESTION
# Used by insights.js
# ============================================================

@app.route(
    "/api/insights/question",
    methods=["POST"]
)
def insights_question():

    try:

        body = request.get_json(
            silent=True
        ) or {}

        question = body.get(
            "question",
            ""
        )

        if not question:

            return jsonify({

                "success": False,

                "answer":
                    "Please enter a question."
            }), 400

        df = load_dataset()

        filtered_df = apply_filters(

            df,

            gender=body.get("gender"),

            age_group=body.get("age_group"),

            illness=body.get("illness"),

            health=body.get("health"),

            chronic=body.get("chronic"),

            private=body.get("private"),

            freepoor=body.get("freepoor"),

            freerepat=body.get("freerepat"),

            min_visits=body.get("min_visits"),

            max_visits=body.get("max_visits")
        )

        answer = answer_question(
            filtered_df,
            question
        )

        return jsonify({

            "success": True,

            "answer": answer
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "answer":
                "Unable to process the healthcare question.",

            "error": str(e)

        }), 500


# ============================================================
# VERCEL ENTRY POINT
# ============================================================

# Do NOT use app.run() on Vercel.
# Vercel imports this Flask application as `app`.

# ============================================================
# LOCAL DEVELOPMENT SERVER
# ============================================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
