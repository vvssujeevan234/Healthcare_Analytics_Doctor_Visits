# ============================================================
# HEALTHCARE ANALYTICS
# INSIGHTS + AI ASSISTANT
# ============================================================


# ============================================================
# AUTOMATED INSIGHT GENERATOR
# ============================================================

def generate_insight(df):

    # --------------------------------------------------------
    # Empty dataset
    # --------------------------------------------------------

    if df.empty:

        return {
            "title": "No matching records",
            "message": "The selected filters returned no records."
        }


    # --------------------------------------------------------
    # Basic statistics
    # --------------------------------------------------------

    total_records = len(df)

    average_age = df["age"].mean()

    average_visits = df["visits"].mean()

    average_income = df["income"].mean()

    average_health = df["health"].mean()

    average_illness = df["illness"].mean()


    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    gender_counts = (
        df["gender"]
        .astype(str)
        .value_counts()
    )

    if not gender_counts.empty:

        most_common_gender = str(
            gender_counts.index[0]
        )

        gender_count = int(
            gender_counts.iloc[0]
        )

    else:

        most_common_gender = "N/A"

        gender_count = 0


    # --------------------------------------------------------
    # Visits
    # --------------------------------------------------------

    max_visits = int(
        df["visits"].max()
    )

    min_visits = int(
        df["visits"].min()
    )


    # --------------------------------------------------------
    # Illness
    # --------------------------------------------------------

    max_illness = int(
        df["illness"].max()
    )

    min_illness = int(
        df["illness"].min()
    )


    # --------------------------------------------------------
    # Chronic conditions
    # --------------------------------------------------------

    chronic_count = int(
        (
            (df["nchronic"] > 0) |
            (df["lchronic"] > 0)
        ).sum()
    )


    # --------------------------------------------------------
    # Private healthcare
    # --------------------------------------------------------

    private_count = int(
        df["private"].sum()
    )


    # --------------------------------------------------------
    # Reduced activity
    # --------------------------------------------------------

    reduced_count = int(
        df["reduced"].sum()
    )


    # --------------------------------------------------------
    # Automated message
    # --------------------------------------------------------

    message = (

        f"The filtered dataset contains "
        f"{total_records:,} records. "

        f"The average patient age is "
        f"{average_age:.2f} years, while the "
        f"average recorded doctor visits is "
        f"{average_visits:.2f}. "

        f"The average income value is "
        f"{average_income:.2f}. "

        f"The most represented gender is "
        f"{most_common_gender} with "
        f"{gender_count:,} records. "

        f"The recorded visit values range from "
        f"{min_visits} to {max_visits}. "

        f"The illness values range from "
        f"{min_illness} to {max_illness}. "

        f"{chronic_count:,} records indicate "
        f"at least one chronic-condition indicator. "

        f"{private_count:,} records have the "
        f"private healthcare indicator enabled. "

        f"{reduced_count:,} records have the "
        f"reduced-activity indicator enabled."
    )


    return {

        "title": "Automated Dataset Summary",

        "message": message,

        "statistics": {

            "total_records": total_records,

            "average_age": round(
                average_age,
                2
            ),

            "average_visits": round(
                average_visits,
                2
            ),

            "average_income": round(
                average_income,
                2
            ),

            "average_health": round(
                average_health,
                2
            ),

            "average_illness": round(
                average_illness,
                2
            ),

            "max_visits": max_visits,

            "max_illness": max_illness,

            "most_common_gender":
                most_common_gender,

            "gender_count":
                gender_count,

            "chronic_records":
                chronic_count,

            "private_records":
                private_count,

            "reduced_records":
                reduced_count
        }
    }


# ============================================================
# AI QUESTION ANSWER
# ============================================================

def answer_question(df, question):

    # --------------------------------------------------------
    # Empty dataset
    # --------------------------------------------------------

    if df.empty:

        return (
            "There are no records matching "
            "the current filters."
        )


    # --------------------------------------------------------
    # Clean question
    # --------------------------------------------------------

    q = (
        question
        .lower()
        .strip()
    )


    # ========================================================
    # RECORD COUNT
    # ========================================================

    if (
        ("how many" in q or
         "number of" in q or
         "count" in q)
        and
        ("record" in q or
         "patient" in q)
    ):

        return (
            f"The current filtered dataset "
            f"contains {len(df):,} records."
        )


    # ========================================================
    # AVERAGE AGE
    # ========================================================

    if (
        "average age" in q
        or
        "mean age" in q
    ):

        return (
            f"The average patient age is "
            f"{df['age'].mean():.2f} years."
        )


    # ========================================================
    # MINIMUM AGE
    # ========================================================

    if (
        "youngest" in q
        or
        "minimum age" in q
        or
        "lowest age" in q
    ):

        return (
            f"The minimum recorded age is "
            f"{df['age'].min():.0f} years."
        )


    # ========================================================
    # MAXIMUM AGE
    # ========================================================

    if (
        "oldest" in q
        or
        "maximum age" in q
        or
        "highest age" in q
    ):

        return (
            f"The maximum recorded age is "
            f"{df['age'].max():.0f} years."
        )


    # ========================================================
    # AVERAGE VISITS
    # ========================================================

    if (
        (
            "average" in q
            or
            "mean" in q
        )
        and
        "visit" in q
    ):

        return (
            f"The average number of recorded "
            f"doctor visits is "
            f"{df['visits'].mean():.2f}."
        )


    # ========================================================
    # HIGHEST VISITS
    # ========================================================

    if (
        (
            "highest" in q
            or
            "maximum" in q
            or
            "max" in q
        )
        and
        "visit" in q
    ):

        return (
            f"The highest recorded visit value "
            f"is {int(df['visits'].max())}."
        )


    # ========================================================
    # LOWEST VISITS
    # ========================================================

    if (
        (
            "lowest" in q
            or
            "minimum" in q
            or
            "min" in q
        )
        and
        "visit" in q
    ):

        return (
            f"The lowest recorded visit value "
            f"is {int(df['visits'].min())}."
        )


    # ========================================================
    # GENDER
    # ========================================================

    if "gender" in q:

        counts = (
            df["gender"]
            .astype(str)
            .value_counts()
        )


        if not counts.empty:

            gender = str(
                counts.index[0]
            )

            count = int(
                counts.iloc[0]
            )

            return (
                f"The most represented gender "
                f"is {gender}, with "
                f"{count:,} records."
            )


    # ========================================================
    # INCOME
    # ========================================================

    if (
        "income" in q
        and
        (
            "average" in q
            or
            "mean" in q
        )
    ):

        return (
            f"The average income value "
            f"is {df['income'].mean():.2f}."
        )


    # ========================================================
    # HEALTH
    # ========================================================

    if "health" in q:

        return (
            f"The average health value in the "
            f"current filtered data is "
            f"{df['health'].mean():.2f}."
        )


    # ========================================================
    # ILLNESS
    # ========================================================

    if "illness" in q:

        return (
            f"The highest illness level in "
            f"the current filtered data is "
            f"{int(df['illness'].max())}. "
            f"The average illness value is "
            f"{df['illness'].mean():.2f}."
        )


    # ========================================================
    # CHRONIC CONDITIONS
    # ========================================================

    if (
        "chronic" in q
        or
        "chronic condition" in q
    ):

        chronic_count = int(
            (
                (df["nchronic"] > 0) |
                (df["lchronic"] > 0)
            ).sum()
        )

        return (
            f"{chronic_count:,} records in the "
            f"current filtered dataset have at "
            f"least one chronic-condition indicator."
        )


    # ========================================================
    # PRIVATE HEALTHCARE
    # ========================================================

    if "private" in q:

        private_count = int(
            df["private"].sum()
        )

        return (
            f"{private_count:,} records have "
            f"the private healthcare indicator "
            f"enabled."
        )


    # ========================================================
    # FREE / POOR
    # ========================================================

    if (
        "freepoor" in q
        or
        "free poor" in q
        or
        "poor" in q
    ):

        count = int(
            df["freepoor"].sum()
        )

        return (
            f"{count:,} records have the "
            f"free-poor healthcare indicator "
            f"enabled."
        )


    # ========================================================
    # REDUCED ACTIVITY
    # ========================================================

    if (
        "reduced" in q
        or
        "activity" in q
    ):

        count = int(
            df["reduced"].sum()
        )

        return (
            f"{count:,} records have the "
            f"reduced-activity indicator "
            f"enabled."
        )


    # ========================================================
    # DASHBOARD
    # ========================================================

    if "dashboard" in q:

        return (

            "The dashboard provides an interactive "
            "Power BI-style view of the healthcare "
            "doctor-visits dataset. It can be used "
            "to explore demographics, age, visits, "
            "income, illness, health, healthcare "
            "access indicators and chronic-condition "
            "variables."
        )


    # ========================================================
    # INSIGHTS
    # ========================================================

    if (
        "insight" in q
        or
        "insights" in q
    ):

        return (

            "The Insights page summarizes important "
            "patterns found in the available "
            "healthcare doctor-visits dataset. "
            "It focuses on patient characteristics, "
            "healthcare visits, illness, health, "
            "healthcare access and relationships "
            "between variables."
        )


    # ========================================================
    # DATASET
    # ========================================================

    if (
        "dataset" in q
        or
        "data" in q
    ):

        return (

            f"The current filtered dataset contains "
            f"{len(df):,} records and includes "
            f"variables related to visits, gender, "
            f"age, income, illness, reduced activity, "
            f"healthcare access and chronic conditions."
        )


    # ========================================================
    # GENERAL RESPONSE
    # ========================================================

    return (

        "I can answer questions about the current "
        "healthcare dataset, including record count, "
        "average age, visits, gender, income, health, "
        "illness, chronic conditions, private healthcare "
        "and reduced activity. Try asking: "
        "\"What is the average age?\" or "
        "\"How many records are there?\""
    )