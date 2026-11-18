import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

print("Loading dataset...")

# Load dataset
df = pd.read_csv(r"C:\Users\User\OneDrive\Desktop\Cancer_Project\master_cancer_dataset.csv")

print("Dataset shape:", df.shape)

# -----------------------------
# STEP 1: Clean missing values
# -----------------------------
df = df.replace("NA", np.nan)

# Fill numeric columns with 0
for col in df.select_dtypes(include=["int64", "float64"]).columns:
    df[col] = df[col].fillna(0)

# Fill categorical columns with 'Unknown'
for col in df.select_dtypes(include=["object"]).columns:
    df[col] = df[col].fillna("Unknown")

print("Missing values handled")

# -----------------------------
# STEP 2: Remove unnecessary columns
# -----------------------------
for col in ["Patient_ID", "ID"]:
    if col in df.columns:
        df = df.drop(columns=[col])

print("ID columns removed if present")

# -----------------------------
# STEP 3: Separate target
# -----------------------------
target = "Diagnosis"

if target not in df.columns:
    raise ValueError(f"Target column '{target}' not found in dataset")

y = df[target]
X = df.drop(columns=[target])

print("Target selected:", target)

# -----------------------------
# STEP 4: One-hot encode features
# -----------------------------
X = pd.get_dummies(X, drop_first=True)

print("One-hot encoding completed")
print("Encoded feature shape:", X.shape)

# Save feature column names for backend use
joblib.dump(X.columns.tolist(), "model_columns.pkl")
print("Model columns saved as model_columns.pkl")

# -----------------------------
# STEP 5: Encode target labels
# -----------------------------
from sklearn.preprocessing import LabelEncoder

target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)

joblib.dump(target_encoder, "target_encoder.pkl")
print("Target encoder saved as target_encoder.pkl")

# -----------------------------
# STEP 6: Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))

# -----------------------------
# STEP 7: Train improved model
# -----------------------------
print("Training model...")

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Training completed")

# -----------------------------
# STEP 8: Evaluate model
# -----------------------------
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Model Accuracy:", accuracy)

# Decode labels for readable report
y_test_labels = target_encoder.inverse_transform(y_test)
y_pred_labels = target_encoder.inverse_transform(y_pred)

print("\nClassification Report:\n")
print(classification_report(y_test_labels, y_pred_labels))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test_labels, y_pred_labels))

# -----------------------------
# STEP 9: Save model
# -----------------------------
joblib.dump(model, "cancer_model.pkl")

print("\nModel saved as cancer_model.pkl")
print("Training pipeline completed successfully")
