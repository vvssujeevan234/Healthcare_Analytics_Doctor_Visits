from pathlib import Path
import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

API_DIR = Path(__file__).resolve().parent
PROJECT_DIR = API_DIR.parent

DATA_FILE = API_DIR / "data" / "healthcare_doctor_visits.csv"


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_FILE}"
        )

    df = pd.read_csv(DATA_FILE)

    # --------------------------------------------------------
    # Clean column names
    # --------------------------------------------------------

    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
    )

    # --------------------------------------------------------
    # Remove CSV index column if present
    # --------------------------------------------------------

    unnamed_columns = [
        column
        for column in df.columns
        if str(column).lower().startswith("unnamed")
    ]

    if unnamed_columns:
        df = df.drop(
            columns=unnamed_columns
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
        "health"
    ]

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # --------------------------------------------------------
    # Age conversion
    #
    # Dataset stores age as:
    # 0.19 = 19 years
    # 0.40 = 40 years
    # 0.72 = 72 years
    # --------------------------------------------------------

    if "age" in df.columns:

        df["age"] = df["age"] * 100

    # --------------------------------------------------------
    # Categorical columns
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
                .astype(str)
                .str.strip()
                .str.lower()
            )

    # --------------------------------------------------------
    # Remove invalid core rows
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

    return str(DATA_FILE)


# ============================================================
# DATASET INFORMATION
# ============================================================

def get_dataset_info():

    df = load_dataset()

    return {

        "rows":
            int(len(df)),

        "columns":
            int(len(df.columns)),

        "column_names":
            df.columns.tolist(),

        "path":
            str(DATA_FILE),

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