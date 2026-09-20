from flask import Flask, jsonify, request
from flask_cors import CORS

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

CORS(app)


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return jsonify({

        "success": True,

        "message":
            "Healthcare Analytics Flask API is running on Vercel.",

        "dataset":
            get_dataset_path()

    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health")
def health():

    try:

        df = load_dataset()

        return jsonify({

            "success": True,

            "status": "connected",

            "rows":
                int(len(df)),

            "columns":
                int(len(df.columns))

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "status": "error",

            "error":
                str(e)

        }), 500


# ============================================================
# DATASET INFO
# ============================================================

@app.route("/api/dataset")
def dataset():

    try:

        return jsonify({

            "success": True,

            "data":
                get_dataset_info()

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error":
                str(e)

        }), 500


# ============================================================
# DASHBOARD
# ============================================================

@app.route("/api/dashboard")
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

            "filter_count":
                int(len(filtered_df)),

            "statistics":
                statistics(filtered_df),

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

            "error":
                str(e)

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

            "answer":
                answer

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "answer":
                "Unable to process the question.",

            "error":
                str(e)

        }), 500


# ============================================================
# VERCEL
# ============================================================

# Do NOT use app.run() here.