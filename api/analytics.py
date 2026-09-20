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
# SAFE CATEGORICAL CONVERSION
# ============================================================

def categorical_columns(df):

    result = df.copy()

    categorical = [

        "gender",
        "private",
        "freepoor",
        "freerepat",
        "nchronic",
        "lchronic"

    ]

    for column in categorical:

        if column in result.columns:

            result[column] = (
                result[column]
                .astype("string")
                .str.strip()
            )

    return result


# ============================================================
# PREPARE DATA
# ============================================================

def prepare_data(df):

    result = numeric_columns(
        df
    )

    result = categorical_columns(
        result
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
# AGE GROUP LABELS
# ============================================================

def get_age_groups():

    return [

        "0-17",
        "18-29",
        "30-44",
        "45-59",
        "60+"

    ]


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

    filtered = prepare_data(
        df
    ).copy()


    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    if (
        gender
        and str(gender).lower() != "all"
    ):

        if "gender" in filtered.columns:

            filtered = filtered[
                filtered["gender"]
                .astype(str)
                .str.lower()
                ==
                str(gender).lower()
            ]


    # --------------------------------------------------------
    # Age group
    # --------------------------------------------------------

    if (
        age_group
        and str(age_group).lower() != "all"
    ):

        if "age" in filtered.columns:

            filtered = filtered[
                filtered["age"].apply(
                    get_age_group
                )
                ==
                str(age_group)
            ]


    # --------------------------------------------------------
    # Illness
    # --------------------------------------------------------

    if (
        illness
        and str(illness).lower() != "all"
    ):

        if "illness" in filtered.columns:

            try:

                value = float(
                    illness
                )

                filtered = filtered[
                    filtered["illness"]
                    == value
                ]

            except (
                ValueError,
                TypeError
            ):

                pass


    # --------------------------------------------------------
    # Health
    # --------------------------------------------------------

    if (
        health
        and str(health).lower() != "all"
    ):

        if "health" in filtered.columns:

            try:

                value = float(
                    health
                )

                filtered = filtered[
                    filtered["health"]
                    == value
                ]

            except (
                ValueError,
                TypeError
            ):

                pass


    # --------------------------------------------------------
    # Chronic
    # --------------------------------------------------------

    if (
        chronic
        and str(chronic).lower() != "all"
    ):

        if "nchronic" in filtered.columns:

            value = str(
                chronic
            ).strip()

            filtered = filtered[
                filtered["nchronic"]
                .astype(str)
                .str.strip()
                == value
            ]


    # --------------------------------------------------------
    # Private
    # --------------------------------------------------------

    if (
        private
        and str(private).lower() != "all"
    ):

        if "private" in filtered.columns:

            value = str(
                private
            ).strip()

            filtered = filtered[
                filtered["private"]
                .astype(str)
                .str.strip()
                .str.lower()
                ==
                value.lower()
            ]


    # --------------------------------------------------------
    # Free Poor
    # --------------------------------------------------------

    if (
        freepoor
        and str(freepoor).lower() != "all"
    ):

        if "freepoor" in filtered.columns:

            value = str(
                freepoor
            ).strip()

            filtered = filtered[
                filtered["freepoor"]
                .astype(str)
                .str.strip()
                .str.lower()
                ==
                value.lower()
            ]


    # --------------------------------------------------------
    # Free Repat
    # --------------------------------------------------------

    if (
        freerepat
        and str(freerepat).lower() != "all"
    ):

        if "freerepat" in filtered.columns:

            value = str(
                freerepat
            ).strip()

            filtered = filtered[
                filtered["freerepat"]
                .astype(str)
                .str.strip()
                .str.lower()
                ==
                value.lower()
            ]


    # --------------------------------------------------------
    # Minimum Visits
    # --------------------------------------------------------

    if (
        min_visits
        not in [None, ""]
    ):

        try:

            value = float(
                min_visits
            )

            filtered = filtered[
                filtered["visits"]
                >= value
            ]

        except (
            ValueError,
            TypeError
        ):

            pass


    # --------------------------------------------------------
    # Maximum Visits
    # --------------------------------------------------------

    if (
        max_visits
        not in [None, ""]
    ):

        try:

            value = float(
                max_visits
            )

            filtered = filtered[
                filtered["visits"]
                <= value
            ]

        except (
            ValueError,
            TypeError
        ):

            pass


    return filtered.reset_index(
        drop=True
    )


# ============================================================
# HISTOGRAM
# ============================================================

def histogram(
    values,
    bins=10
):

    values = pd.to_numeric(
        pd.Series(values),
        errors="coerce"
    ).dropna()


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


    for i in range(
        len(edges) - 1
    ):

        labels.append(
            f"{edges[i]:.2f}-{edges[i + 1]:.2f}"
        )


    return {

        "labels":
            labels,

        "values":
            counts.astype(int)
            .tolist()

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
        .value_counts()
    )


    return {

        "labels":
            counts.index
            .tolist(),

        "values":
            counts.values
            .astype(int)
            .tolist()

    }


# ============================================================
# AGE DISTRIBUTION
# ============================================================

def age_distribution(df):

    if "age" not in df.columns:

        return {
            "labels": [],
            "values": []
        }


    return histogram(
        df["age"],
        bins=10
    )


# ============================================================
# VISIT DISTRIBUTION
# ============================================================

def visit_distribution(df):

    if "visits" not in df.columns:

        return {
            "labels": [],
            "values": []
        }


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
            if float(x).is_integer()
            else str(x)
            for x in counts.index
        ],

        "values":
            counts.values
            .astype(int)
            .tolist()

    }


# ============================================================
# AVERAGE VISITS BY GENDER
# ============================================================

def gender_average_visits(df):

    if (
        "gender" not in df.columns
        or
        "visits" not in df.columns
    ):

        return {
            "labels": [],
            "values": []
        }


    temp = df.copy()

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )


    result = (
        temp
        .dropna(
            subset=["visits"]
        )
        .groupby("gender")["visits"]
        .mean()
        .round(2)
    )


    return {

        "labels":
            result.index
            .astype(str)
            .tolist(),

        "values":
            result.values
            .tolist()

    }


# ============================================================
# ILLNESS VS VISITS
# ============================================================

def illness_vs_visits(df):

    if (
        "illness" not in df.columns
        or
        "visits" not in df.columns
    ):

        return {
            "labels": [],
            "values": []
        }


    temp = df.copy()


    temp["illness"] = pd.to_numeric(
        temp["illness"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )


    result = (
        temp
        .dropna(
            subset=[
                "illness",
                "visits"
            ]
        )
        .groupby("illness")["visits"]
        .mean()
        .round(2)
    )


    return {

        "labels":
            result.index
            .astype(str)
            .tolist(),

        "values":
            result.values
            .tolist()

    }


# ============================================================
# ILLNESS DISTRIBUTION
# ============================================================

def illness_distribution(df):

    if "illness" not in df.columns:

        return {
            "labels": [],
            "values": []
        }


    values = pd.to_numeric(
        df["illness"],
        errors="coerce"
    ).dropna()


    result = (
        values
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

    required = [
        "age",
        "visits",
        "gender"
    ]


    if not all(
        column in df.columns
        for column in required
    ):

        return []


    temp = df[
        required
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
                float(row["age"]),

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

    if (
        "age" not in df.columns
        or
        "visits" not in df.columns
    ):

        return {
            "labels": [],
            "values": []
        }


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


    order = get_age_groups()


    result = (
        temp
        .dropna(
            subset=["visits"]
        )
        .groupby(
            "age_group"
        )["visits"]
        .mean()
        .reindex(order)
        .dropna()
        .round(2)
    )


    return {

        "labels":
            result.index
            .tolist(),

        "values":
            result.values
            .tolist()

    }


# ============================================================
# CHRONIC CONDITIONS
# ============================================================

def chronic_analysis(df):

    if (
        "nchronic" not in df.columns
        or
        "visits" not in df.columns
    ):

        return {
            "labels": [],
            "values": []
        }


    temp = df.copy()


    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )


    result = (
        temp
        .dropna(
            subset=["visits"]
        )
        .groupby(
            "nchronic"
        )["visits"]
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
            result.values
            .tolist()

    }


# ============================================================
# HEALTH STATUS
# ============================================================

def health_analysis(df):

    if (
        "health" not in df.columns
        or
        "visits" not in df.columns
    ):

        return {
            "labels": [],
            "values": []
        }


    temp = df.copy()


    temp["health"] = pd.to_numeric(
        temp["health"],
        errors="coerce"
    )

    temp["visits"] = pd.to_numeric(
        temp["visits"],
        errors="coerce"
    )


    result = (
        temp
        .dropna(
            subset=[
                "health",
                "visits"
            ]
        )
        .groupby(
            "health"
        )["visits"]
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
            result.values
            .tolist()

    }


# ============================================================
# CORRELATION MATRIX
# ============================================================

def correlation_matrix(df):

    temp = numeric_columns(
        df
    )


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
            correlation.columns
            .tolist(),

        "values":
            correlation.values
            .tolist()

    }


# ============================================================
# KPI STATISTICS
# ============================================================

def statistics(df):

    temp = numeric_columns(
        df
    )


    visits = pd.to_numeric(
        temp.get(
            "visits",
            pd.Series(
                dtype=float
            )
        ),
        errors="coerce"
    )


    age = pd.to_numeric(
        temp.get(
            "age",
            pd.Series(
                dtype=float
            )
        ),
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


    average_age = (
        age.mean()
        if age.notna().any()
        else 0
    )


    return {

        "total_records":
            int(len(temp)),

        "total_visits":
            int(total_visits),

        "average_visits":
            round(
                float(average_visits),
                2
            ),

        "average_age":
            round(
                float(average_age),
                2
            )

    }


# ============================================================
# RECENT RECORDS
# ============================================================

def recent_records(
    df,
    limit=10
):

    try:

        limit = int(
            limit
        )

    except (
        ValueError,
        TypeError
    ):

        limit = 10


    limit = max(
        1,
        min(
            limit,
            100
        )
    )


    records = (
        df
        .head(limit)
        .copy()
    )


    records = records.astype(
        object
    )


    records = records.where(
        pd.notna(records),
        None
    )


    return {

        "columns":
            records.columns
            .tolist(),

        "rows":
            records.values
            .tolist()

    }


# ============================================================
# DATASET OVERVIEW
# ============================================================

def dataset_overview(df):

    temp = prepare_data(
        df
    )


    return {

        "rows":
            int(len(temp)),

        "columns":
            int(len(temp.columns)),

        "column_names":
            temp.columns.tolist(),

        "missing_values":
            {
                column:
                int(value)
                for column, value
                in temp.isnull()
                .sum()
                .items()
            },

        "duplicate_rows":
            int(
                temp.duplicated()
                .sum()
            )

    }