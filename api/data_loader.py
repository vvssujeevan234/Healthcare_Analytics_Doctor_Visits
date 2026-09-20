from pathlib import Path
import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

API_DIR = Path(__file__).resolve().parent

DATA_FILE = (
    API_DIR
    / "data"
    / "healthcare_doctor_visits.csv"
)


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():
    """
    Load the healthcare doctor visits CSV dataset.

    Returns
    -------
    pandas.DataFrame
        Cleaned healthcare dataset.
    """

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_FILE}"
        )

    try:

        df = pd.read_csv(
            DATA_FILE
        )

    except Exception as error:

        raise RuntimeError(
            f"Unable to read dataset: {error}"
        )


    # --------------------------------------------------------
    # Remove unnamed index columns
    # --------------------------------------------------------

    unnamed_columns = [
        column
        for column in df.columns
        if str(column)
        .strip()
        .lower()
        .startswith("unnamed")
    ]

    if unnamed_columns:

        df = df.drop(
            columns=unnamed_columns
        )


    # --------------------------------------------------------
    # Clean column names
    # --------------------------------------------------------

    df.columns = [
        str(column)
        .strip()
        .lower()
        for column in df.columns
    ]


    # --------------------------------------------------------
    # Expected numeric columns
    # --------------------------------------------------------

    numeric_columns = [
        "visits",
        "age",
        "income",
        "illness",
        "reduced",
        "health"
    ]


    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )


    # --------------------------------------------------------
    # Expected categorical columns
    # --------------------------------------------------------

    categorical_columns = [
        "gender",
        "private",
        "freepoor",
        "freerepat",
        "nchronic",
        "lchronic"
    ]


    for column in categorical_columns:

        if column in df.columns:

            df[column] = (
                df[column]
                .astype("string")
                .str.strip()
            )


    # --------------------------------------------------------
    # Reset index
    # --------------------------------------------------------

    df = df.reset_index(
        drop=True
    )


    return df


# ============================================================
# DATASET PATH
# ============================================================

def get_dataset_path():
    """
    Return the dataset file path.
    """

    return str(
        DATA_FILE
    )


# ============================================================
# DATASET INFORMATION
# ============================================================

def get_dataset_info():
    """
    Return basic information about the dataset.
    """

    df = load_dataset()

    return {

        "success": True,

        "rows": int(
            len(df)
        ),

        "columns": int(
            len(df.columns)
        ),

        "column_names":
            df.columns.tolist(),

        "path":
            str(DATA_FILE)

    }


# ============================================================
# DATASET PREVIEW
# ============================================================

def get_dataset_preview(
    limit=10
):
    """
    Return first records from dataset.
    """

    df = load_dataset()

    limit = max(
        1,
        min(
            int(limit),
            100
        )
    )

    preview = df.head(
        limit
    ).copy()


    preview = preview.where(
        pd.notna(preview),
        None
    )


    return {

        "columns":
            preview.columns.tolist(),

        "rows":
            preview.values.tolist(),

        "count":
            int(len(preview))

    }


# ============================================================
# DATASET COLUMN TYPES
# ============================================================

def get_column_types():
    """
    Return dataset column data types.
    """

    df = load_dataset()

    return {
        column:
        str(dtype)
        for column, dtype
        in df.dtypes.items()
    }


# ============================================================
# DATASET SUMMARY
# ============================================================

def get_dataset_summary():
    """
    Return complete dataset summary.
    """

    df = load_dataset()

    return {

        "rows":
            int(len(df)),

        "columns":
            int(len(df.columns)),

        "column_names":
            df.columns.tolist(),

        "column_types":
            {
                column:
                str(dtype)
                for column, dtype
                in df.dtypes.items()
            },

        "missing_values":
            {
                column:
                int(value)
                for column, value
                in df.isnull()
                .sum()
                .items()
            },

        "duplicate_rows":
            int(
                df.duplicated()
                .sum()
            )

    }