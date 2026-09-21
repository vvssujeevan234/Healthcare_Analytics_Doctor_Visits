from pathlib import Path
import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DATA_FILE = PROJECT_DIR / "data" / "healthcare_doctor_visits.csv"


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_FILE}"
        )

    df = pd.read_csv(DATA_FILE)

    # Remove unnamed index column if present
    unnamed_columns = [
        col for col in df.columns
        if str(col).lower().startswith("unnamed")
    ]

    if unnamed_columns:
        df = df.drop(columns=unnamed_columns)

    return df


# ============================================================
# DATASET INFORMATION
# ============================================================

def get_dataset_path():

    return str(DATA_FILE)

def get_dataset_info():

    df = load_dataset()

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "column_names": df.columns.tolist(),
        "path": str(DATA_FILE),
        "records": df.to_dict(orient="records")
    }
