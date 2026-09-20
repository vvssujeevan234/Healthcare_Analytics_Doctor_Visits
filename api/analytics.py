import numpy as np
import pandas as pd


# ============================================================
# NUMERIC CONVERSION
# ============================================================

def numeric_columns(df):

    result = df.copy()

    numeric = [
        "visits",
        "age",
        "income",
        "illness",
        "reduced",
        "health"
    ]

    for column in numeric:

        if column in result.columns:

            result[column] = pd.to_numeric(
                result[column],
                errors="coerce"
            )

    return result


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

    filtered = df.copy()

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
    # Age Group
    # --------------------------------------------------------

    if age_group and str(age_group).lower() != "all":

        filtered = filtered[
            filtered["age"].apply(
                get_age_group
            )
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
    #
    # Dataset contains yes/no values.
    # --------------------------------------------------------

    if chronic and str(chronic).lower() != "all":

        filtered = filtered[
            filtered["nchronic"]
            .astype(str)
            .str.lower()
            == str(chronic).lower()
        ]

    # --------------------------------------------------------
    # Private
    # --------------------------------------------------------

    if private and str(private).lower() != "all":

        filtered = filtered[
            filtered["private"]
            .astype(str)
            .str.lower()
            == str(private).lower()
        ]

    # --------------------------------------------------------
    # Free Poor
    # --------------------------------------------------------

    if freepoor and str(freepoor).lower() != "all":

        filtered = filtered[
            filtered["freepoor"]
            .astype(str)
            .str.lower()
            == str(freepoor).lower()
        ]

    # --------------------------------------------------------
    # Free Repat
    # --------------------------------------------------------

    if freerepat and str(freerepat).lower() != "all":

        filtered = filtered[
            filtered["freerepat"]
            .astype(str)
            .str.lower()
            == str(freerepat).lower()
        ]

    # --------------------------------------------------------
    # Minimum Visits
    # --------------------------------------------------------

    if min_visits not in [None, ""]:

        try:

            filtered = filtered[
                filtered["visits"]
                >= float(min_visits)
            ]

        except (ValueError, TypeError):

            pass

    # --------------------------------------------------------
    # Maximum Visits
    # --------------------------------------------------------

    if max_visits not in [None, ""]:

        try:

            filtered = filtered[
                filtered["visits"]
                <= float(max_visits)
            ]

        except (ValueError, TypeError):

            pass

    return filtered


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

        start = round(edges[i], 2)
        end = round(edges[i + 1], 2)

        labels.append(
            f"{start}-{end}"
        )

    return {
        "labels": labels,
        "values": counts.astype(int).tolist()
    }


# ============================================================
# GENDER DISTRIBUTION
# ============================================================

def gender_distribution(df):

    result = (
        df["gender"]
        .astype(str)
        .str.title()
        .value_counts()
    )

    return {
        "labels":
            result.index.tolist(),

        "values":
            result.values.astype(int).tolist()
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

    result = (
        visits
        .value_counts()
        .sort_index()
    )

    return {

        "labels": [
            str(int(value))
            for value in result.index
        ],

        "values":
            result.astype(int).tolist()
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

        "labels":
            result.index
            .astype(str)
            .str.title()
            .tolist(),

        "values":
            result.values.tolist()
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

        "labels":
            result["illness"]
            .astype(str)
            .tolist(),

        "values":
            result["visits"]
            .tolist()
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

        "labels":
            result.index
            .astype(str)
            .tolist(),

        "values":
            result.values
            .astype(int)
            .tolist()
    }


# ============================================================
# AGE VS VISITS
# ============================================================

def age_vs_visits(df):

    columns = [
        "age",
        "visits",
        "gender"
    ]

    temp = df[columns].copy()

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

            "x":
                float(row["age"]),

            "y":
                float(row["visits"]),

            "gender":
                str(row["gender"])
                .title()
        })

    return points


# ============================================================
# AGE GROUP ANALYSIS
# ============================================================

def age_group_analysis(df):

    temp = df.copy()

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
        .groupby("age_group")["visits"]
        .mean()
        .reindex(order)
        .dropna()
        .round(2)
    )

    return {

        "labels":
            result.index.tolist(),

        "values":
            result.values.tolist()
    }


# ============================================================
# CHRONIC CONDITIONS
# ============================================================

def chronic_analysis(df):

    if "nchronic" not in df.columns:

        return {
            "labels": [],
            "values": []
        }

    result = (
        df.groupby("nchronic")["visits"]
        .mean()
        .round(2)
    )

    # Put no before yes
    preferred_order = [
        "no",
        "yes"
    ]

    existing = [
        value
        for value in preferred_order
        if value in result.index
    ]

    remaining = [
        value
        for value in result.index
        if value not in existing
    ]

    final_order = existing + remaining

    result = result.reindex(
        final_order
    )

    return {

        "labels":
            result.index
            .astype(str)
            .str.title()
            .tolist(),

        "values":
            result.values.tolist()
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

        "labels":
            result.index
            .astype(str)
            .tolist(),

        "values":
            result.values.tolist()
    }


# ============================================================
# CORRELATION MATRIX
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
                float(age.mean()),
                2
            )
            if age.notna().any()
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
        df.head(limit)
        .copy()
    )

    records = records.astype(object)

    records = records.where(
        pd.notna(records),
        None
    )

    return {

        "columns":
            records.columns.tolist(),

        "rows":
            records.values.tolist()
    }