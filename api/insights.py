import pandas as pd


# ============================================================
# PREPARE DATA
# ============================================================

def prepare_insight_data(df):
    result = df.copy()

    numeric_columns = [
        "visits",
        "age",
        "income",
        "illness",
        "reduced",
        "health",
    ]

    for column in numeric_columns:
        if column in result.columns:
            result[column] = pd.to_numeric(
                result[column],
                errors="coerce"
            )

    # Dataset contains some yes/no fields as text.
    # Convert them safely to numeric 0/1 where possible.
    binary_columns = [
        "private",
        "freepoor",
        "freerepat",
        "nchronic",
        "lchronic",
    ]

    for column in binary_columns:
        if column in result.columns:

            text = (
                result[column]
                .astype(str)
                .str.strip()
                .str.lower()
            )

            result[column] = text.map({
                "yes": 1,
                "no": 0,
                "1": 1,
                "0": 0,
                "true": 1,
                "false": 0,
            })

            # If original values are numeric strings,
            # recover them safely.
            numeric = pd.to_numeric(
                text,
                errors="coerce"
            )

            result[column] = result[column].fillna(
                numeric
            )

    return result


# ============================================================
# AGE GROUP
# ============================================================

def age_group(age):

    if pd.isna(age):
        return "Unknown"

    age = float(age)

    if age < 18:
        return "0-17"
    elif age < 30:
        return "18-29"
    elif age < 45:
        return "30-44"
    elif age < 60:
        return "45-59"
    else:
        return "60+"


# ============================================================
# GENERATE INSIGHT
# ============================================================

def generate_insight(df):

    if df is None or len(df) == 0:
        return {
            "title": "No Data",
            "summary": "No healthcare records are available.",
            "details": [],
            "type": "info"
        }

    df = prepare_insight_data(df)

    insights = []

    # --------------------------------------------------------
    # BASIC STATISTICS
    # --------------------------------------------------------

    total_records = len(df)

    visits = pd.to_numeric(
        df.get("visits"),
        errors="coerce"
    )

    total_visits = (
        visits.sum()
        if visits.notna().any()
        else 0
    )

    average_visits = (
        visits.mean()
        if visits.notna().any()
        else 0
    )

    insights.append(
        f"The dataset contains {total_records:,} healthcare records "
        f"with {int(total_visits):,} total doctor visits."
    )

    insights.append(
        f"The average number of doctor visits per record is "
        f"{average_visits:.2f}."
    )

    # --------------------------------------------------------
    # GENDER
    # --------------------------------------------------------

    if (
        "gender" in df.columns
        and "visits" in df.columns
    ):

        gender_data = (
            df.groupby("gender")["visits"]
            .mean()
            .dropna()
            .sort_values(ascending=False)
        )

        if len(gender_data) > 0:

            highest_gender = str(
                gender_data.index[0]
            )

            highest_value = float(
                gender_data.iloc[0]
            )

            insights.append(
                f"The highest average visit level by gender "
                f"is observed for {highest_gender}, "
                f"at {highest_value:.2f} visits."
            )

    # --------------------------------------------------------
    # ILLNESS
    # --------------------------------------------------------

    if (
        "illness" in df.columns
        and "visits" in df.columns
    ):

        illness_data = (
            df.groupby("illness")["visits"]
            .mean()
            .dropna()
            .sort_values(ascending=False)
        )

        if len(illness_data) > 0:

            illness_level = illness_data.index[0]
            illness_value = float(
                illness_data.iloc[0]
            )

            insights.append(
                f"Illness level {illness_level} has the "
                f"highest average visits at "
                f"{illness_value:.2f}."
            )

    # --------------------------------------------------------
    # CHRONIC CONDITIONS
    # --------------------------------------------------------

    chronic_columns = []

    if "nchronic" in df.columns:
        chronic_columns.append("nchronic")

    if "lchronic" in df.columns:
        chronic_columns.append("lchronic")

    if chronic_columns:

        chronic_mask = pd.Series(
            False,
            index=df.index
        )

        for column in chronic_columns:

            values = pd.to_numeric(
                df[column],
                errors="coerce"
            )

            chronic_mask = (
                chronic_mask |
                values.fillna(0).gt(0)
            )

        chronic_count = int(
            chronic_mask.sum()
        )

        if chronic_count > 0:

            insights.append(
                f"{chronic_count:,} records indicate "
                f"at least one chronic condition."
            )

            if "visits" in df.columns:

                chronic_visits = pd.to_numeric(
                    df.loc[
                        chronic_mask,
                        "visits"
                    ],
                    errors="coerce"
                ).mean()

                non_chronic_visits = pd.to_numeric(
                    df.loc[
                        ~chronic_mask,
                        "visits"
                    ],
                    errors="coerce"
                ).mean()

                if pd.notna(chronic_visits):

                    insights.append(
                        f"Records with chronic conditions "
                        f"average {chronic_visits:.2f} visits."
                    )

                if pd.notna(non_chronic_visits):

                    insights.append(
                        f"Records without chronic conditions "
                        f"average {non_chronic_visits:.2f} visits."
                    )

    # --------------------------------------------------------
    # HEALTH STATUS
    # --------------------------------------------------------

    if (
        "health" in df.columns
        and "visits" in df.columns
    ):

        health_data = (
            df.groupby("health")["visits"]
            .mean()
            .dropna()
            .sort_values(ascending=False)
        )

        if len(health_data) > 0:

            health_level = health_data.index[0]
            health_visits = float(
                health_data.iloc[0]
            )

            insights.append(
                f"Health level {health_level} "
                f"has an average of "
                f"{health_visits:.2f} visits."
            )

    # --------------------------------------------------------
    # AGE
    # --------------------------------------------------------

    if (
        "age" in df.columns
        and "visits" in df.columns
    ):

        temp = df[
            ["age", "visits"]
        ].copy()

        temp["age"] = pd.to_numeric(
            temp["age"],
            errors="coerce"
        )

        temp["visits"] = pd.to_numeric(
            temp["visits"],
            errors="coerce"
        )

        temp = temp.dropna(
            subset=[
                "age",
                "visits"
            ]
        )

        if len(temp) > 0:

            temp["age_group"] = (
                temp["age"]
                .apply(age_group)
            )

            age_data = (
                temp.groupby(
                    "age_group"
                )["visits"]
                .mean()
                .dropna()
            )

            if len(age_data) > 0:

                highest_age_group = (
                    age_data
                    .sort_values(
                        ascending=False
                    )
                    .index[0]
                )

                highest_age_visits = float(
                    age_data
                    .sort_values(
                        ascending=False
                    )
                    .iloc[0]
                )

                insights.append(
                    f"The {highest_age_group} age group "
                    f"has the highest average visits "
                    f"at {highest_age_visits:.2f}."
                )

    # --------------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------------

    return {
        "title": "Healthcare Analytics Insights",
        "summary": (
            f"Analysis is based on "
            f"{total_records:,} healthcare records."
        ),
        "details": insights,
        "type": "analysis"
    }


# ============================================================
# ANSWER QUESTION
# ============================================================

def answer_question(df, question):

    if not question:
        return "Please enter a healthcare analytics question."

    if df is None or len(df) == 0:
        return "No dataset records are available."

    df = prepare_insight_data(df)

    question_lower = str(
        question
    ).lower()

    # --------------------------------------------------------
    # TOTAL RECORDS
    # --------------------------------------------------------

    if (
        "total records" in question_lower
        or "how many records" in question_lower
        or "number of records" in question_lower
    ):

        return (
            f"The dataset contains "
            f"{len(df):,} records."
        )

    # --------------------------------------------------------
    # TOTAL VISITS
    # --------------------------------------------------------

    if (
        "total visits" in question_lower
        or "how many visits" in question_lower
    ):

        visits = pd.to_numeric(
            df["visits"],
            errors="coerce"
        )

        return (
            f"The dataset contains "
            f"{int(visits.sum()):,} total doctor visits."
        )

    # --------------------------------------------------------
    # AVERAGE VISITS
    # --------------------------------------------------------

    if (
        "average visits" in question_lower
        or "mean visits" in question_lower
    ):

        visits = pd.to_numeric(
            df["visits"],
            errors="coerce"
        )

        return (
            f"The average number of visits is "
            f"{visits.mean():.2f}."
        )

    # --------------------------------------------------------
    # AVERAGE AGE
    # --------------------------------------------------------

    if (
        "average age" in question_lower
        or "mean age" in question_lower
    ):

        age = pd.to_numeric(
            df["age"],
            errors="coerce"
        )

        return (
            f"The average age value in the dataset is "
            f"{age.mean():.2f}."
        )

    # --------------------------------------------------------
    # GENDER
    # --------------------------------------------------------

    if "gender" in question_lower:

        if "gender" in df.columns:

            counts = (
                df["gender"]
                .value_counts()
            )

            result = []

            for gender, count in counts.items():

                result.append(
                    f"{gender}: {count:,}"
                )

            return (
                "Gender distribution: "
                + ", ".join(result)
                + "."
            )

    # --------------------------------------------------------
    # CHRONIC
    # --------------------------------------------------------

    if "chronic" in question_lower:

        chronic_mask = pd.Series(
            False,
            index=df.index
        )

        for column in [
            "nchronic",
            "lchronic"
        ]:

            if column in df.columns:

                values = pd.to_numeric(
                    df[column],
                    errors="coerce"
                )

                chronic_mask = (
                    chronic_mask |
                    values.fillna(0).gt(0)
                )

        return (
            f"{int(chronic_mask.sum()):,} records "
            f"indicate at least one chronic condition."
        )

    # --------------------------------------------------------
    # DEFAULT
    # --------------------------------------------------------

    return (
        "I can answer questions about total records, "
        "doctor visits, average visits, average age, "
        "gender distribution, illness, health status, "
        "age groups, and chronic conditions."
    )