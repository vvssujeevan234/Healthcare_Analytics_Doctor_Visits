import os
import pandas as pd


# ============================================================
# PATHS
# ============================================================

API_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    API_DIR,
    "data",
    "healthcare_doctor_visits.csv"
)


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    df = pd.read_csv(DATASET_PATH)

    # --------------------------------------------------------
    # Clean column names
    # --------------------------------------------------------

    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
    )

    # --------------------------------------------------------
    # Remove CSV index column
    # --------------------------------------------------------

    if "Unnamed: 0" in df.columns:
        df = df.drop(
            columns=["Unnamed: 0"]
        )

    # --------------------------------------------------------
    # Numeric columns
    # --------------------------------------------------------

    numeric_columns = [
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

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # --------------------------------------------------------
    # Categorical columns
    # --------------------------------------------------------

    categorical_columns = [
        "gender",
        "private",
        "freepoor",
        "freerepat"
    ]

    for column in categorical_columns:

        if column in df.columns:

            # Do not destroy useful numeric values
            if column in [
                "private",
                "freepoor",
                "freerepat"
            ]:
                continue

            df[column] = (
                df[column]
                .astype(str)
                .str.strip()
            )

    # --------------------------------------------------------
    # Remove rows where core values are invalid
    # --------------------------------------------------------

    core_columns = [
        column
        for column in [
            "visits",
            "age",
            "income",
            "illness",
            "health"
        ]
        if column in df.columns
    ]

    if core_columns:

        df = df.dropna(
            subset=core_columns
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

    return DATASET_PATH


# ============================================================
# DATASET INFORMATION
# ============================================================

def get_dataset_info():

    df = load_dataset()

    return {

        "column_names":
            list(df.columns),

        "columns":
            int(len(df.columns)),

        "rows":
            int(len(df)),

        "path":
            DATASET_PATH,

        "dtypes": {
            column: str(dtype)
            for column, dtype
            in df.dtypes.items()
        },

        "missing_values": {
            column: int(value)
            for column, value
            in df.isnull().sum().items()
        }
    }