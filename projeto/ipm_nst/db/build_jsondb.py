import os
import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path
from collections import defaultdict

def load_csv(path):
    df = pd.read_csv(path)
    df = df.replace([pd.NA, pd.NaT, np.nan, np.inf, -np.inf], None)
    df = df.astype(object)
    df = df.where(pd.notnull(df), None)
    return df.to_dict(orient="records")

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def collect_data(base_dir):
    data = {}
    base_dir = Path(base_dir).resolve()

    for root, _, files in os.walk(base_dir):
        for file in files:
            ext = Path(file).suffix.lower()

            path = Path(root) / file
            rel_path = path.relative_to(base_dir)
            parts = list(rel_path.parts)
            parts[-1] = Path(parts[-1]).stem  # replace filename with stem (no extension)
            key = ".".join(rel_path.with_suffix("").parts)  # Flatten into dotted key

            try:
                if ext == ".csv":
                    content = load_csv(path)
                else:
                    content = load_json(path)
                data[key] = content
            except:
                print(f"Skipping file {path}");

    return data

def main():
    base_dir = sys.argv[1].strip()
    output_path = "db.json"

    db_data = collect_data(base_dir)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(db_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()