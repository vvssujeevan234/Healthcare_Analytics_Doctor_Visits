# Healthcare Analytics — Doctor Visits Analysis

A full-stack healthcare data analytics project that analyzes doctor-visit records and presents the results through an interactive web application.

The project combines **Python, Pandas, NumPy, Flask, HTML, CSS, JavaScript, Matplotlib, Seaborn, and Jupyter Notebook** to transform healthcare data into meaningful statistical analysis, visualizations, automated insights, and an interactive AI-style question-answer assistant.

---

## 📌 Project Overview

**Healthcare Analytics — Doctor Visits Analysis** is an educational data analytics project developed to explore and understand healthcare doctor-visit records.

The application analyzes different aspects of the available healthcare dataset, including:

- Patient demographics
- Age
- Gender
- Doctor visits
- Income
- Health
- Illness
- Healthcare access
- Private healthcare
- Free/poor healthcare
- Reduced activity
- Chronic conditions
- Relationships between variables

The project follows an end-to-end analytics workflow:

```text
Raw Healthcare Dataset
        ↓
Data Loading
        ↓
Data Understanding
        ↓
Data Preprocessing
        ↓
Exploratory Data Analysis
        ↓
Statistical Analysis
        ↓
Data Visualization
        ↓
Insight Generation
        ↓
Flask Backend API
        ↓
Interactive Frontend
        ↓
Healthcare Analytics Dashboard
        ↓
AI Analytics Assistant
🎯 Project Objective

The main objective of this project is to analyze healthcare doctor-visit records and transform raw data into understandable statistical and visual information.

The project aims to:

Understand the structure of the healthcare dataset.
Load and inspect healthcare records.
Perform data preprocessing.
Analyze patient demographic characteristics.
Study doctor-visit patterns.
Analyze age and gender distributions.
Examine health and illness variables.
Analyze healthcare-access indicators.
Examine chronic-condition indicators.
Analyze reduced-activity indicators.
Explore relationships between important variables.
Create statistical visualizations.
Generate automated dataset insights.
Provide an interactive dashboard.
Provide an AI-style question-answer assistant.
Present the complete analytics workflow through a web application.Project Features
1. Home Page

The home page provides an introduction to the Healthcare Analytics project.

It provides navigation to the major sections of the application:

Home
Dashboard
Data Understanding
Preprocessing
Analysis
Insights
About2. Interactive Dashboard

The dashboard provides a visual overview of the healthcare doctor-visits dataset.

The dashboard can present information related to:

Total records
Average patient age
Doctor visits
Gender distribution
Income
Health
Illness
Healthcare access
Chronic conditions
Reduced activity
Relationships between variables

The dashboard is designed as a Power BI-style analytical interface
3. Data Understanding

The Data Understanding section explains the structure and characteristics of the healthcare dataset.

It covers:

Dataset overview
Dataset structure
Number of records
Available columns
Data types
Numerical variables
Categorical variables
Healthcare-related variables
Patient-related variables4. Data Preprocessing

The preprocessing section explains the steps used to prepare the dataset for analysis.

Typical preprocessing activities include:

Loading the CSV dataset
Inspecting the dataset
Checking the number of rows and columns
Checking column names
Checking data types
Checking missing values
Checking duplicate records
Generating descriptive statistics
Preparing variables for analysis5. Statistical Analysis

The project uses Python-based statistical analysis to understand the healthcare dataset.

The analysis can include:

Count
Mean
Minimum
Maximum
Standard deviation
Frequency distribution
Grouped analysis
Correlation analysis
6. Data Visualization

The project uses different visualization techniques to understand patterns in the data.

Visualizations can include:

Bar charts
Histograms
Pie charts
Scatter plots
Box plots
Correlation plots

These visualizations make statistical patterns easier to understand.
🤖 AI Healthcare Analytics Assistant

The project includes an AI-style question-answer interface that allows users to ask questions about the currently available healthcare dataset.

The assistant is implemented using the frontend JavaScript and Flask backend.

The main backend functions are:

generate_insight(df)

and:

answer_question(df, question)

The generate_insight() function creates an automated summary of the selected dataset.

The answer_question() function processes supported questions and returns analytical answers based on the dataset.
💬 Example Questions

The assistant can answer questions such as:

How many records are there?
What is the average age?
What is the minimum age?
What is the maximum age?
What is the average number of visits?
What is the highest visit value?
What is the lowest visit value?
What is the most represented gender?
What is the average income?
What is the average health?
What is the highest illness level?
How many chronic condition records are there?
How many private healthcare records are there?
How many free poor records are there?
How many records have reduced activity?
What is the purpose of the dashboard?
What are the insights?
📊 Automated Insight Generation

The backend contains an automated insight generator.

The function:

generate_insight(df)

generates a summary based on the current filtered dataset.

The summary can include:

Total records
Average age
Average visits
Average income
Average health
Average illness
Most represented gender
Gender record count
Minimum visits
Maximum visits
Minimum illness
Maximum illness
Chronic-condition records
Private healthcare records
Reduced-activity records

Example structure:

The filtered dataset contains X records.
The average patient age is X years,
while the average recorded doctor visits is X.
The average income value is X.
The most represented gender is X with X records.
The recorded visit values range from X to X.
The illness values range from X to X.
X records indicate at least one chronic-condition indicator.
X records have the private healthcare indicator enabled.
X records have the reduced-activity indicator enabled.

The actual values depend on the healthcare dataset and the selected filters.

📁 Dataset

The project uses the following dataset:

data/healthcare_doctor_visits.csv

The dataset contains healthcare doctor-visit records and variables related to patient characteristics, healthcare utilization, health, illness, income, healthcare access, and chronic conditions.

📋 Important Dataset Variables

The backend currently works with variables including:

Variable	Description
age	Patient age
gender	Gender category
visits	Recorded doctor visits
income	Income-related value
health	Health-related value
illness	Illness-related value
nchronic	Chronic-condition indicator
lchronic	Chronic-condition indicator
private	Private healthcare indicator
freepoor	Free/poor healthcare indicator
reduced	Reduced-activity indicator

The exact interpretation of each dataset variable should follow the dataset documentation and the analysis performed in the project.

🧮 Analytical Areas
Demographic Analysis

The project analyzes patient demographic characteristics such as:

Age
Gender
Patient distribution

Example questions:

What is the average age?
What is the minimum age?
What is the maximum age?
Which gender is most represented?
Healthcare Visit Analysis

The visits variable is used to analyze healthcare utilization.

The project can calculate:

Average visits
Minimum visits
Maximum visits
Visit distributions
Visit patterns

Example questions:

What is the average number of visits?
What is the highest visit value?
What is the lowest visit value?
Income Analysis

The project uses the income variable to calculate and analyze income-related statistics.

Example:

What is the average income?
Health Analysis

The health variable is used to examine health-related values in the dataset.

Example:

What is the average health?
Illness Analysis

The illness variable is used to examine illness-related values.

The project can calculate:

Average illness
Maximum illness
Minimum illness
Illness distribution

Example:

What is the highest illness level?
Gender Analysis

Gender values are analyzed using frequency counts.

The project identifies the most represented gender within the current filtered dataset.

Chronic Condition Analysis

The project considers a record to have at least one chronic-condition indicator when either chronic-condition variable is greater than zero.

The calculation is:

(df["nchronic"] > 0) | (df["lchronic"] > 0)

The resulting number of records is used in the automated insight summary.

Private Healthcare Analysis

The private variable is used to count records where the private healthcare indicator is enabled.

Example:

int(df["private"].sum())
Free/Poor Healthcare Analysis

The freepoor variable is used to count records where the free/poor healthcare indicator is enabled.

Example:

int(df["freepoor"].sum())
Reduced Activity Analysis

The reduced variable is used to identify records with the reduced-activity indicator enabled.

Example:

int(df["reduced"].sum())
🏗️ Project Architecture
Healthcare Analytics/
│
├── venv/
│
├── backend/
│   ├── app.py
│   ├── analytics.py
│   ├── data_loader.py
│   ├── insights.py
│   └── requirements.txt
│
├── data/
│   └── healthcare_doctor_visits.csv
│
├── docs/
│   ├── API.md
│   ├── DATA_ANALYSIS.md
│   ├── PROJECT_DESCRIPTION.md
│   └── RESULTS.md
│
├── frontend/
│   ├── index.html
│   │
│   ├── pages/
│   │   ├── about.html
│   │   ├── analysis.html
│   │   ├── dashboard.html
│   │   ├── data-understanding.html
│   │   ├── insights.html
│   │   ├── portfolio.html
│   │   └── preprocessing.html
│   │
│   ├── css/
│   │   ├── about.css
│   │   ├── analysis.css
│   │   ├── dashboard.css
│   │   ├── data-understanding.css
│   │   ├── insights.css
│   │   ├── portfolio.css
│   │   ├── preprocessing.css
│   │   ├── responsive.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── about.js
│   │   ├── analysis.js
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── data-understanding.js
│   │   ├── insights.js
│   │   ├── portfolio.js
│   │   ├── preprocessing.js
│   │   └── robot.js
│   │
│   └── assets/
│       ├── images/
│       └── videos/
│
└── notebooks/
    └── Healthcare_Analytics_Doctor_Visits.ipynb
🔧 Technology Stack
Frontend
HTML5
CSS3
JavaScript
Responsive Web Design
Backend
Python
Flask
Pandas
NumPy
Data Analysis
Jupyter Notebook
Pandas
NumPy
Matplotlib
Seaborn
Development Tools
Visual Studio Code
Python
Git
GitHub
Modern Web Browser
🐍 Backend Components
app.py

app.py is the main Flask application.

Responsibilities include:

Starting the Flask server
Loading application modules
Defining API routes
Receiving frontend requests
Processing requests
Returning responses
Connecting the frontend with Python analytics
analytics.py

analytics.py contains analytical functions used by the application.

It can be used for:

Dataset analysis
Statistical calculations
Filtering
Aggregation
Preparing data for visualization
data_loader.py

data_loader.py is responsible for loading the healthcare CSV dataset.

The loaded DataFrame is passed to the analytical functions.

insights.py

insights.py contains the automated insight and question-answer functionality.

Main functions:

generate_insight(df)

and:

answer_question(df, question)
requirements.txt

The backend dependency file contains the Python packages required by the application.

Example dependencies may include:

Flask
pandas
numpy

Additional packages should be included when required by the actual application.

🌐 Frontend Components
index.html

The main landing page of the Healthcare Analytics application.

dashboard.html

Provides the interactive dashboard.

data-understanding.html

Explains the dataset and its variables.

preprocessing.html

Explains the data preparation process.

analysis.html

Presents statistical analysis and visualizations.

insights.html

Presents:

Key findings
Insight dimensions
Analytical questions
Data interpretation
Healthcare AI assistant
about.html

Contains information about the project.

🎨 Frontend Design

The frontend uses a modern healthcare analytics interface.

The design includes:

Responsive navigation
Healthcare-themed visual design
Cinematic background images
Background video
Interactive cards
Smooth scrolling
Animated sections
Dashboard-style layouts
AI assistant interface
Responsive mobile navigation

Frontend assets are stored under:

frontend/assets/
🔌 Frontend and Backend Communication

The application follows this communication flow:

Frontend
   │
   │ HTTP Request
   ▼
Flask Backend
   │
   ▼
Python Analytics
   │
   ▼
Healthcare CSV
   │
   ▼
Calculated Result
   │
   ▼
Flask Response
   │
   ▼
Frontend

For the AI assistant:

User Question
      ↓
insights.js
      ↓
Flask API
      ↓
answer_question()
      ↓
Pandas DataFrame
      ↓
Analytical Answer
      ↓
Frontend Chat Window
📓 Jupyter Notebook

The project contains:

notebooks/Healthcare_Analytics_Doctor_Visits.ipynb

The notebook is used for exploratory and statistical analysis.

Typical notebook workflow:

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

Load the dataset:

df = pd.read_csv("../data/healthcare_doctor_visits.csv")

View the first records:

df.head()

View the last records:

df.tail()

View dataset shape:

df.shape

View columns:

df.columns

View information:

df.info()

View descriptive statistics:

df.describe()

Check missing values:

df.isnull().sum()

Check duplicate records:

df.duplicated().sum()
📊 Analytical Questions

The project can investigate questions such as:

What are the main characteristics of the healthcare doctor-visits dataset?
How many records are present?
What is the average patient age?
What is the minimum patient age?
What is the maximum patient age?
How are records distributed across gender categories?
Which gender is most represented?
What is the average number of doctor visits?
What is the highest recorded visit value?
What is the lowest recorded visit value?
What is the average income?
What is the average health value?
What is the average illness value?
What is the highest illness value?
How many records contain chronic-condition indicators?
How many records have private healthcare indicators?
How many records have free/poor healthcare indicators?
How many records have reduced-activity indicators?
What relationships exist between important variables?
What patterns can be observed from the visualizations?
What conclusions can be drawn from the statistical analysis?
📈 Results

The project results should be documented in:

docs/RESULTS.md

The results document should contain actual values obtained from the dataset and notebook.

It may include:

Dataset dimensions
Age statistics
Gender distribution
Visit statistics
Income statistics
Health statistics
Illness statistics
Chronic-condition counts
Private healthcare counts
Free/poor healthcare counts
Reduced-activity counts
Visualization observations
Correlation observations
Overall analytical conclusions

Actual results should be generated from the dataset rather than manually estimated.

📚 Documentation

The project contains a dedicated documentation directory:

docs/
PROJECT_DESCRIPTION.md

Contains:

Project introduction
Problem statement
Project objectives
Scope
Features
Technology stack
Project architecture
DATA_ANALYSIS.md

Contains:

Dataset description
Dataset variables
Data loading
Data preprocessing
Statistical methods
Visualization methods
Analytical questions
RESULTS.md

Contains:

Actual analysis results
Statistical observations
Visualization observations
Important patterns
Conclusions
API.md

Contains:

Flask API endpoints
HTTP methods
Request parameters
Response formats
Frontend/backend communication
⚙️ Installation
Step 1 — Clone the Repository
git clone <YOUR-GITHUB-REPOSITORY-URL>

Move into the project directory:

cd Healthcare-Analytics
Step 2 — Create Virtual Environment

If venv does not already exist:

python -m venv venv
Step 3 — Activate Virtual Environment
Windows PowerShell
.\venv\Scripts\Activate.ps1
Windows Command Prompt
venv\Scripts\activate
Step 4 — Install Backend Dependencies

Move into the backend directory:

cd backend

Install the dependencies:

pip install -r requirements.txt
▶️ Running the Backend

From the backend directory:

python app.py

The Flask application will normally be available at:

http://127.0.0.1:5000

The exact address and port depend on the configuration in app.py.

Keep the backend terminal running while using the frontend.

▶️ Running the Frontend

Open another VS Code terminal.

Move to the project root:

cd ..

Start a simple local web server:

python -m http.server 5500

Then open:

http://127.0.0.1:5500/frontend/

Using a local web server is recommended instead of opening the HTML files directly.

🖥️ Running Backend and Frontend Together

Use two VS Code terminals.

Terminal 1 — Flask Backend
.\venv\Scripts\Activate.ps1
cd backend
python app.py
Terminal 2 — Frontend Server
python -m http.server 5500

Then open:

http://127.0.0.1:5500/frontend/
🔐 Environment Variables

The current project does not require a .env file if no external API keys, database passwords, or other secret configuration values are being used.

The .gitignore can still contain:

.env

This prevents a future .env file from accidentally being committed to GitHub.

📂 Git Ignore

The project should not commit the Python virtual environment or Python cache files.

Recommended .gitignore:

venv/
__pycache__/
*.pyc
.env

The following should normally remain outside Git:

venv/
__pycache__/
*.pyc
.env
🧪 Testing

Before considering the project complete, test the following.

Backend Testing
Flask starts successfully
Dataset loads correctly
API endpoints respond correctly
Empty dataset handling works
Filtering works
Statistical calculations work
Automated insights work
Question answering works
Frontend Testing
Home page loads
Navigation works
Dashboard loads
Data Understanding page loads
Preprocessing page loads
Analysis page loads
Insights page loads
About page loads
Images load correctly
Background video loads correctly
Mobile navigation works
AI assistant opens
AI assistant closes
Quick questions work
User questions work
Integration Testing

Verify the complete workflow:

Frontend
   ↓
Flask API
   ↓
Python Backend
   ↓
Healthcare Dataset
   ↓
Analysis
   ↓
JSON Response
   ↓
Frontend
🐛 Troubleshooting
Flask does not start

Activate the virtual environment:

.\venv\Scripts\Activate.ps1

Then:

cd backend
python app.py
ModuleNotFoundError

Install the requirements:

pip install -r requirements.txt
Dataset Not Found

Verify that the dataset exists at:

data/healthcare_doctor_visits.csv

Also verify that the path used in data_loader.py correctly points to the dataset.

Frontend Cannot Connect to Backend

Check that Flask is running.

Open:

http://127.0.0.1:5000

Also check that the API URL used by the frontend JavaScript matches the route configured in app.py.

AI Assistant Does Not Connect to Flask

Check the communication flow:

insights.js
     ↓
fetch()
     ↓
app.py
     ↓
insights.py
     ↓
answer_question()
     ↓
JSON response
     ↓
insights.js
     ↓
Chat window

If insights.js uses only a local getAssistantResponse() function, the assistant is operating from frontend-defined responses rather than the Flask backend.

🛡️ Healthcare Disclaimer

This project is developed for educational and data analytics purposes.

The analysis describes patterns represented in the available dataset.

The results should not be interpreted as:

Individual medical diagnoses
Treatment recommendations
Medical prescriptions
Clinical decisions
Professional medical advice
Predictions about an individual patient's health

The AI-style assistant is designed to help users explore the dataset and understand its analytical information.

🔒 Data Privacy

Healthcare-related data should be handled responsibly.

When using this project:

Use authorized datasets.
Avoid exposing personally identifiable information.
Do not publish confidential patient information.
Do not use the application as a clinical decision-making system.
Ensure that any dataset shared publicly is appropriate for public use.
🚀 Future Enhancements

Possible future improvements include:

Advanced dashboard filtering
Dynamic charts from Flask APIs
More analytical questions
Natural-language dataset querying
Advanced statistical analysis
Interactive correlation analysis
CSV export
PDF report generation
Automated report generation
Database integration
User authentication
Role-based access
Cloud deployment
Advanced AI integration
Additional healthcare visualizations
🎓 Academic Project
Project Name

Healthcare Analytics — Doctor Visits Analysis

Project Type

Data Analytics and Full-Stack Web Application

Main Domain

Healthcare Data Analytics

Technologies
Python
Pandas
NumPy
Matplotlib
Seaborn
Flask
HTML5
CSS3
JavaScript
Jupyter Notebook
Git
GitHub
Visual Studio Code
📌 Project Workflow Summary
                    HEALTHCARE DATA
                          │
                          ▼
                   DATA LOADING
                          │
                          ▼
                DATA UNDERSTANDING
                          │
                          ▼
                  PREPROCESSING
                          │
                          ▼
              EXPLORATORY ANALYSIS
                          │
                          ▼
              STATISTICAL ANALYSIS
                          │
                          ▼
                 VISUALIZATION
                          │
                          ▼
                INSIGHT GENERATION
                          │
                          ▼
                  FLASK BACKEND
                          │
                          ▼
                REST API / JSON
                          │
                          ▼
              INTERACTIVE FRONTEND
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
         DASHBOARD     ANALYSIS     INSIGHTS
                                        │
                                        ▼
                               AI ANALYTICS
                                 ASSISTANT
📄 Main Project Files
backend/app.py

Main Flask application.

backend/analytics.py

Data analysis functions.

backend/data_loader.py

Healthcare CSV loading functionality.

backend/insights.py

Automated insights and dataset question answering.

data/healthcare_doctor_visits.csv

Healthcare doctor-visits dataset.

frontend/index.html

Main application landing page.

frontend/pages/dashboard.html

Healthcare analytics dashboard.

frontend/pages/analysis.html

Data analysis page.

frontend/pages/insights.html

Insights and AI assistant page.

frontend/js/insights.js

Insights page interaction and AI assistant frontend functionality.

notebooks/Healthcare_Analytics_Doctor_Visits.ipynb

Jupyter Notebook for data analysis.

📚 Documentation Files
docs/API.md

Backend API documentation.

docs/DATA_ANALYSIS.md

Dataset and analytical methodology.

docs/PROJECT_DESCRIPTION.md

Project description and objectives.

docs/RESULTS.md

Actual analytical results and observations.

📝 Conclusion

The Healthcare Analytics — Doctor Visits Analysis project demonstrates an end-to-end approach to healthcare data analytics.

The project starts with a raw healthcare doctor-visits dataset and progresses through:

Data Loading
      ↓
Data Understanding
      ↓
Data Preprocessing
      ↓
Exploratory Data Analysis
      ↓
Statistical Analysis
      ↓
Visualization
      ↓
Insight Generation
      ↓
Flask API
      ↓
Interactive Web Application

The final application provides a structured way to explore patient, demographic, healthcare utilization, health, illness, healthcare-access, and chronic-condition variables.

The combination of Jupyter Notebook analysis, Python analytics, Flask backend services, and an interactive HTML/CSS/JavaScript frontend provides a complete academic healthcare analytics workflow.

⭐ Project Highlights
Full-stack healthcare analytics application
Python-based data analysis
Flask backend
Pandas and NumPy processing
Matplotlib and Seaborn analysis
Interactive HTML/CSS/JavaScript frontend
Healthcare dashboard
Data understanding section
Preprocessing section
Statistical analysis
Automated insights
AI-style dataset assistant
Responsive design
Jupyter Notebook analysis
Structured project documentation
Git/GitHub ready project structure

Healthcare Analytics — Doctor Visits Analysis

Transforming healthcare records into understandable data insights.