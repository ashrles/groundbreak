import pandas as pd
import os
import glob

RAW_DIR = "data/raw"
OUTPUT_FILE = "data/cleaned/permits.csv"

def load_all_permits(raw_dir: str) -> pd.DataFrame:
    """Load and combine all yearly permit Excel files (.xlsx and .xls)."""
    all_files = sorted(
        glob.glob(os.path.join(raw_dir, "*.xlsx")) +
        glob.glob(os.path.join(raw_dir, "*.xls"))
    )

    if not all_files:
        raise FileNotFoundError(f"No Excel files found in {raw_dir}")

    frames = []
    for file in all_files:
        print(f"Loading: {file}")
        try:
            df = pd.read_excel(file, sheet_name=0, header=0)
            print(f"  → {len(df)} rows, columns: {df.columns.tolist()}")
            frames.append(df)
        except Exception as e:
            print(f"  Skipped {file}: {e}")

    combined = pd.concat(frames, ignore_index=True)
    print(f"\nTotal rows before cleaning: {len(combined)}")
    return combined


def clean_permits(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the combined permits dataframe."""

    # Normalize column names: lowercase, strip whitespace, replace spaces with underscores
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(r"[^a-z0-9]+", "_", regex=True)
        .str.strip("_")
    )

    print("\nColumns found:", df.columns.tolist())

    # Drop rows that are completely empty
    df.dropna(how="all", inplace=True)

    # Drop duplicate rows
    df.drop_duplicates(inplace=True)

    # Parse issue date to datetime if the column exists
    date_col = next((c for c in df.columns if "date" in c), None)
    if date_col:
        df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
        df["year"] = df[date_col].dt.year
        df["month"] = df[date_col].dt.month
        print(f"Parsed dates from column: '{date_col}'")

    # Parse permit value to numeric if the column exists
    value_col = next((c for c in df.columns if "value" in c or "cost" in c), None)
    if value_col:
        df[value_col] = pd.to_numeric(df[value_col], errors="coerce")
        print(f"Parsed values from column: '{value_col}'")

    # Drop rows where the date couldn't be parsed
    if date_col:
        before = len(df)
        df.dropna(subset=[date_col], inplace=True)
        dropped = before - len(df)
        if dropped:
            print(f"Dropped {dropped} rows with unparseable dates")

    print(f"\nTotal rows after cleaning: {len(df)}")
    return df


def main():
    df = load_all_permits(RAW_DIR)
    df = clean_permits(df)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"\nCleaned data saved to: {OUTPUT_FILE}")
    print(df.head())


if __name__ == "__main__":
    main()