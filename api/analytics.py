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

    filtered = numeric_columns(df)

    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    if gender and str(gender).lower() != "all":

        filtered = filtered[
            filtered["gender"]
            .astype(str)
            .str.lower()
            == str(gender).lower()
        ]

    # --------------------------------------------------------
    # Age group
    # --------------------------------------------------------

    if age_group and str(age_group).lower() != "all":

        filtered = filtered[
            filtered["age"]
            .apply(get_age_group)
            == age_group
        ]

    # --------------------------------------------------------
    # Illness
    # --------------------------------------------------------

    if illness and str(illness).lower() != "all":

        try:

            value = float(illness)

            filtered = filtered[
                filtered["illness"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Health
    # --------------------------------------------------------

    if health and str(health).lower() != "all":

        try:

            value = float(health)

            filtered = filtered[
                filtered["health"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Chronic
    # --------------------------------------------------------

    if chronic and str(chronic).lower() != "all":

        try:

            value = float(chronic)

            filtered = filtered[
                filtered["nchronic"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Private
    # --------------------------------------------------------

    if private and str(private).lower() != "all":

        try:

            value = float(private)

            filtered = filtered[
                filtered["private"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Free Poor
    # --------------------------------------------------------

    if freepoor and str(freepoor).lower() != "all":

        try:

            value = float(freepoor)

            filtered = filtered[
                filtered["freepoor"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Free Repat
    # --------------------------------------------------------

    if freerepat and str(freerepat).lower() != "all":

        try:

            value = float(freerepat)

            filtered = filtered[
                filtered["freerepat"] == value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Minimum visits
    # --------------------------------------------------------

    if min_visits not in [None, ""]:

        try:

            value = float(min_visits)

            filtered = filtered[
                filtered["visits"] >= value
            ]

        except (ValueError, TypeError):
            pass

    # --------------------------------------------------------
    # Maximum visits
    # --------------------------------------------------------

    if max_visits not in [None, ""]:

        try:

            value = float(max_visits)

            filtered = filtered[
                filtered["visits"] <= value
            ]

        except (ValueError, TypeError):
            pass

    return filtered.reset_index(drop=True)


# ============================================================
# AGE GROUP
# ============================================================

def get_age_group(age):

    if pd.isna(age):
        return "Unknown"

    age = float(age)

    # Your dataset stores normalized age values.
    # 0.19 - 0.72 corresponds to approximately 19 - 72 years.
    actual_age = age * 100

    if actual_age < 18:
        return "0-17"

    elif actual_age < 30:
        return "18-29"

    elif actual_age < 45:
        return "30-44"

    elif actual_age < 60:
        return "45-59"

    else:
        return "60+"


# ============================================================
# HISTOGRAM
# ============================================================

def histogram(values, bins=10):

    values = pd.to_numeric(
        pd.Series(values),
        errors="coerce"
    ).dropna()

    if len(values) == 0:

        return {
            "labels": [],
            "values": []
        }

    minimum = float(values.min())
    maximum = float(values.max())

    if minimum == maximum:

        return {
            "labels": [
                str(round(minimum, 2))
            ],
            "values": [
                int(len(values))
            ]
        }

    counts, edges = np.histogram(
        values,
        bins=bins
    )

    labels = []

    for i in range(len(edges) - 1):

        labels.append(
            f"{edges[i]:.2f}-{edges[i + 1]:.2f}"
        )

    return {
        "labels": labels,
        "values": counts.astype(int).tolist()
    }


# ============================================================
# GENDER DISTRIBUTION
# ============================================================

def gender_distribution(df):

    if "gender" not in df.columns:

        return {
            "labels": [],
            "values": []
        }

    counts = (
        df["gender"]
        .astype(str)
        .str.strip()
        .value_counts()
    )

    return {
        "labels":
            counts.index.tolist(),

        "values":
            counts.astype(int).tolist()
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

    counts = (
        visits
        .value_counts()
        .sort_index()
    )

    return {
        "labels": [
            str(int(x))
            for x in counts.index
        ],

        "values":
            counts.astype(int).tolist()
    }


# ============================================================
# AVERAGE VISITS BY GENDER
# ============================================================

def gender_average_visits(df):

    temp = df.copy()

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    result = (
        temp
        .groupby("gender")["visits"]
        .mean()
        .round(2)
    )

    return {
        "labels":
            result.index.astype(str).tolist(),

        "values":
            result.fillna(0).tolist()
    }


# ============================================================
# ILLNESS VS VISITS
# ============================================================

def illness_vs_visits(df):

    temp = df.copy()

    temp["illness"] = pd.to_numeric(
        temp["illness"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    temp = temp.dropna(
        subset=[
            "illness",
            "visits"
        ]
    )

    result = (
        temp
        .groupby("illness")["visits"]
        .mean()
        .sort_index()
        .round(2)
    )

    return {
        "labels":
            result.index.astype(str).tolist(),

        "values":
            result.tolist()
    }


# ============================================================
# ILLNESS DISTRIBUTION
# ============================================================

def illness_distribution(df):

    illness = pd.to_numeric(
        df["illness"],
        errors="coerce"
    ).dropna()

    result = (
        illness
        .value_counts()
        .sort_index()
    )

    return {
        "labels":
            result.index.astype(str).tolist(),

        "values":
            result.astype(int).tolist()
    }


# ============================================================
# AGE VS VISITS
# ============================================================

def age_vs_visits(df):

    temp = df[
        [
            "age",
            "visits",
            "gender"
        ]
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

    points = []

    for _, row in temp.iterrows():

        points.append({

            "x":
                float(row["age"]) * 100,

            "y":
                float(row["visits"]),

            "gender":
                str(row["gender"])
        })

    return points


# ============================================================
# AGE GROUP ANALYSIS
# ============================================================

def age_group_analysis(df):

    temp = df.copy()

    temp["age"] = pd.to_numeric(
        temp["age"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    temp["age_group"] = (
        temp["age"]
        .apply(get_age_group)
    )

    order = [
        "0-17",
        "18-29",
        "30-44",
        "45-59",
        "60+"
    ]

    result = (
        temp
        .groupby(
            "age_group",
            observed=False
        )["visits"]
        .mean()
        .reindex(order)
        .dropna()
        .round(2)
    )

    return {
        "labels":
            result.index.tolist(),

        "values":
            result.tolist()
    }


# ============================================================
# CHRONIC CONDITIONS
# ============================================================

def chronic_analysis(df):

    temp = df.copy()

    temp["nchronic"] = pd.to_numeric(
        temp["nchronic"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    temp = temp.dropna(
        subset=[
            "nchronic",
            "visits"
        ]
    )

    if temp.empty:

        return {
            "labels": [],
            "values": []
        }

    result = (
        temp
        .groupby("nchronic")["visits"]
        .mean()
        .sort_index()
        .round(2)
    )

    return {
        "labels":
            result.index.astype(str).tolist(),

        "values":
            result.tolist()
    }


# ============================================================
# HEALTH STATUS
# ============================================================

def health_analysis(df):

    temp = df.copy()

    temp["health"] = pd.to_numeric(
        temp["health"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )

    temp = temp.dropna(
        subset=[
            "health",
            "visits"
        ]
    )

    result = (
        temp
        .groupby("health")["visits"]
        .mean()
        .sort_index()
        .round(2)
    )

    return {
        "labels":
            result.index.astype(str).tolist(),

        "values":
            result.tolist()
    }


# ============================================================
# CORRELATION MATRIX
# ============================================================

def correlation_matrix(df):

    temp = numeric_columns(df)

    numeric = temp.select_dtypes(
        include=["number"]
    )

    if numeric.empty:

        return {
            "labels": [],
            "values": []
        }

    correlation = (
        numeric
        .corr()
        .round(2)
        .fillna(0)
    )

    return {
        "labels":
            correlation.columns.tolist(),

        "values":
            correlation.values.tolist()
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

    # Dataset age is normalized.
    actual_age = age * 100

    return {

        "total_records":
            int(len(df)),

        "total_visits":
            int(visits.sum()),

        "average_visits":
            round(
                float(visits.mean()),
                2
            )
            if visits.notna().any()
            else 0,

        "average_age":
            round(
                float(actual_age.mean()),
                2
            )
            if actual_age.notna().any()
            else 0
    }


# ============================================================
# RECENT RECORDS
# ============================================================

def recent_records(
    df,
    limit=10
):

    records = (
        df
        .head(limit)
        .copy()
    )

    records = records.replace(
        {
            np.nan: None
        }
    )

    return {

        "columns":
            records.columns.tolist(),

        "rows":
            records.values.tolist()
    }