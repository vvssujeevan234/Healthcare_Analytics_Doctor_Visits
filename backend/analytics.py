import numpy as np
import pandas as pd


# ============================================================
# SAFE NUMERIC CONVERSION
# ============================================================

def numeric_columns(df):

    result = df.copy()

    numeric = [
        "visits",
        "age",
        "income",
        "illness",
        "reduced",
        "health",
        "private",
        "freepoor",
        "freerepat",
        "nchronic",
        "lchronic"
    ]

    for column in numeric:

        if column in result.columns:

            result[column] = pd.to_numeric(
                result[column],
                errors="coerce"
            )

    return result


# ============================================================
# FILTER DATA
# ============================================================

def apply_filters(
    df,
    gender=None,
    age_group=None,
    illness=None,
    health=None,
    chronic=None,
    private=None,
    freepoor=None,
    freerepat=None,
    min_visits=None,
    max_visits=None
):

    df = numeric_columns(df)

    filtered = df.copy()

    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    if gender and gender.lower() != "all":

        filtered = filtered[
            filtered["gender"]
            .astype(str)
            .str.lower()
            == gender.lower()
        ]


    # --------------------------------------------------------
    # Age group
    # --------------------------------------------------------

    if age_group and age_group.lower() != "all":

        filtered = filtered[
            filtered["age"].apply(
                lambda x: get_age_group(x)
            )
            == age_group
        ]


    # --------------------------------------------------------
    # Illness
    # --------------------------------------------------------

    if illness and illness.lower() != "all":

        try:

            illness_value = float(illness)

            filtered = filtered[
                filtered["illness"] == illness_value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Health
    # --------------------------------------------------------

    if health and health.lower() != "all":

        try:

            health_value = float(health)

            filtered = filtered[
                filtered["health"] == health_value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Chronic conditions
    # --------------------------------------------------------

    if chronic and chronic.lower() != "all":

        try:

            chronic_value = float(chronic)

            filtered = filtered[
                filtered["nchronic"] == chronic_value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Private
    # --------------------------------------------------------

    if private and private.lower() != "all":

        try:

            value = float(private)

            filtered = filtered[
                filtered["private"] == value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Free Poor
    # --------------------------------------------------------

    if freepoor and freepoor.lower() != "all":

        try:

            value = float(freepoor)

            filtered = filtered[
                filtered["freepoor"] == value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Free Repat
    # --------------------------------------------------------

    if freerepat and freerepat.lower() != "all":

        try:

            value = float(freerepat)

            filtered = filtered[
                filtered["freerepat"] == value
            ]

        except ValueError:

            pass


    # --------------------------------------------------------
    # Visit range
    # --------------------------------------------------------

    if min_visits not in [None, ""]:

        try:

            filtered = filtered[
                filtered["visits"]
                >= float(min_visits)
            ]

        except ValueError:

            pass


    if max_visits not in [None, ""]:

        try:

            filtered = filtered[
                filtered["visits"]
                <= float(max_visits)
            ]

        except ValueError:

            pass


    return filtered


# ============================================================
# AGE GROUP
# ============================================================

def get_age_group(age):

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
# HISTOGRAM
# ============================================================

def histogram(values, bins=10):

    values = pd.Series(values).dropna()

    if len(values) == 0:

        return {
            "labels": [],
            "values": []
        }

    counts, edges = np.histogram(
        values,
        bins=bins
    )

    labels = []

    for i in range(len(edges) - 1):

        labels.append(
            f"{edges[i]:.0f}-{edges[i + 1]:.0f}"
        )

    return {
        "labels": labels,
        "values": counts.astype(int).tolist()
    }


# ============================================================
# GENDER DISTRIBUTION
# ============================================================

def gender_distribution(df):

    counts = (
        df["gender"]
        .astype(str)
        .value_counts()
    )

    return {
        "labels": counts.index.tolist(),
        "values": counts.values.astype(int).tolist()
    }


# ============================================================
# AGE DISTRIBUTION
# ============================================================

def age_distribution(df):

    return histogram(
        df["age"],
        bins=10
    )


# ============================================================
# VISIT DISTRIBUTION
# ============================================================

def visit_distribution(df):

    visits = pd.to_numeric(
        df["visits"],
        errors="coerce"
    ).dropna()

    if len(visits) == 0:

        return {
            "labels": [],
            "values": []
        }

    counts = visits.value_counts().sort_index()

    return {
        "labels": [
            str(int(x))
            for x in counts.index
        ],
        "values": counts.astype(int).tolist()
    }


# ============================================================
# AVERAGE VISITS BY GENDER
# ============================================================

def gender_average_visits(df):

    result = (
        df.groupby("gender")["visits"]
        .mean()
        .round(2)
    )

    return {
        "labels": result.index.astype(str).tolist(),
        "values": result.values.tolist()
    }


# ============================================================
# ILLNESS VS VISITS
# ============================================================

def illness_vs_visits(df):

    result = (
        df.groupby("illness")["visits"]
        .mean()
        .round(2)
        .reset_index()
    )

    return {
        "labels": result["illness"].astype(str).tolist(),
        "values": result["visits"].tolist()
    }


# ============================================================
# ILLNESS DISTRIBUTION
# ============================================================

def illness_distribution(df):

    result = (
        df["illness"]
        .value_counts()
        .sort_index()
    )

    return {
        "labels": result.index.astype(str).tolist(),
        "values": result.values.astype(int).tolist()
    }


# ============================================================
# AGE VS VISITS
# ============================================================

def age_vs_visits(df):

    temp = df[
        ["age", "visits", "gender"]
    ].copy()

    temp["age"] = pd.to_numeric(
        temp["age"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    temp = temp.dropna()

    points = []

    for _, row in temp.iterrows():

        points.append({
            "x": float(row["age"]),
            "y": float(row["visits"]),
            "gender": str(row["gender"])
        })

    return points


# ============================================================
# AGE GROUP ANALYSIS
# ============================================================

def age_group_analysis(df):

    temp = df.copy()

    temp["age_group"] = temp["age"].apply(
        get_age_group
    )

    order = [
        "0-17",
        "18-29",
        "30-44",
        "45-59",
        "60+"
    ]

    result = (
        temp.groupby("age_group")["visits"]
        .mean()
        .reindex(order)
        .dropna()
        .round(2)
    )

    return {
        "labels": result.index.tolist(),
        "values": result.values.tolist()
    }


# ============================================================
# CHRONIC CONDITIONS
# ============================================================

def chronic_analysis(df):

    result = (
        df.groupby("nchronic")["visits"]
        .mean()
        .sort_index()
        .round(2)
    )

    return {
        "labels": result.index.astype(str).tolist(),
        "values": result.values.tolist()
    }


# ============================================================
# HEALTH STATUS
# ============================================================

def health_analysis(df):

    result = (
        df.groupby("health")["visits"]
        .mean()
        .sort_index()
        .round(2)
    )

    return {
        "labels": result.index.astype(str).tolist(),
        "values": result.values.tolist()
    }


# ============================================================
# CORRELATION
# ============================================================

def correlation_matrix(df):

    numeric = df.select_dtypes(
        include=["number"]
    )

    correlation = (
        numeric
        .corr()
        .round(2)
        .fillna(0)
    )

    return {
        "labels": correlation.columns.tolist(),
        "values": correlation.values.tolist()
    }


# ============================================================
# KPI STATISTICS
# ============================================================

def statistics(df):

    visits = pd.to_numeric(
        df["visits"],
        errors="coerce"
    )

    age = pd.to_numeric(
        df["age"],
        errors="coerce"
    )

    return {

        "total_records":
            int(len(df)),

        "total_visits":
            int(visits.sum()),

        "average_visits":
            round(float(visits.mean()), 2)
            if visits.notna().any()
            else 0,

        "average_age":
            round(float(age.mean()), 2)
            if age.notna().any()
            else 0
    }


# ============================================================
# RECENT RECORDS
# ============================================================

def recent_records(df, limit=10):

    records = df.head(limit).copy()

    records = records.replace(
        {np.nan: None}
    )

    return {
        "columns": records.columns.tolist(),
        "rows": records.values.tolist()
    }