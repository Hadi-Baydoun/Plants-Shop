Project Overview
This ecommerce website is dedicated to the sale of plants and includes a comprehensive admin CMS and front-end site. The system architecture includes:

Backend: Developed in ASP.NET MVC 8, utilizing a MySQL database.
Frontend: Built with React.JS.
Components
plantsshop.admin: Administrative interface for managing products.
PlantsShop.API: Set of APIs for backend functionality.
plantsshop.website: User-facing website.
API Documentation
The backend APIs are well-documented using Swagger and support the following HTTP methods:

GET
POST
PUT
DELETE
Each table in the database correlates to a distinct model and controller. For frontend operations, the Material UI (MUI) library is paired with Axios for efficient API handling.

Setup Instructions
Before deploying the project, please follow these setup steps:

Environment Setup
Database Preparation:

The database will be made available for download shortly.
Project Configuration:

Open Visual Studio.
Navigate to the plantsshop.admin and plantsshop.website projects.
Open the terminal within Visual Studio.
Dependency Installation:

Execute the following commands:
bash
Copy code
npm i
npm i @fullcalendar/timegrid @fullcalendar/interaction
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom
Project Initialization:

Right-click on the solution in Visual Studio.
Select "Configure Startup Project."
Choose "Multiple Startup Projects" and activate all three projects (plantsshop.admin, PlantsShop.API, plantsshop.website).
Start the Solution:

Run the solution.
Additional dependencies may be prompted for installation during this process.
