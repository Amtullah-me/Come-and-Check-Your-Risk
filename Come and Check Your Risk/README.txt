# OncoGen Care Project (Final SQLite Version)

## What was added
- SQLite database connection
- Real signup and login system
- Password hashing for safer storage
- Session-based dashboard access
- Logout route
- Blog route
- Existing cancer prediction route kept intact

## Project structure
- app.py
- oncogen_care.db
- cancer_model.pkl
- model_columns.pkl
- target_encoder.pkl
- label_encoders.pkl
- master_cancer_dataset.csv
- train_model.py
- templates/
  - login.html
  - signup.html
  - index.html
  - Blog.html
- static/
  - style.css
  - script.js
- requirements.txt

## How to run
1. Install dependencies:
   pip install -r requirements.txt

2. Start the app:
   python app.py

3. Open in browser:
   http://127.0.0.1:5000

## Main routes
- /          -> login page
- /signup    -> signup page
- /dashboard -> main dashboard (after login)
- /blog      -> blog page (after login)
- /logout    -> logout
- /predict   -> cancer prediction API
