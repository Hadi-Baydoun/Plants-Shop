Project Overview

This project is an ecommerce website focused on selling plants. It comprises a MySQL database and an Admin CMS to manage products along with the actual website. The backend is developed using ASP .NET MVC 8, while the frontend utilizes React.JS. The project folder contains three main projects:

1. plantsshop.admin: Admin Page
2. PlantsShop.API: APIs
3. plantsshop.website: Website
   
The backend APIs are documented using Swagger, featuring four HTTP methods:

1. HttpGet
2. HttpPost
3. HttpPut
4. HttpDelete
   
In the backend, each table in the database is associated with a model and a controller. For the frontend, MUI library is utilized along with Axios for API handling.

Setup Instructions

To run the project locally, follow these steps:

1. Download the database (will be uploaded later).
2. Make sure you have Node.js installed.
3. Using Visual Studio, navigate to the plantsshop.admin and plantsshop.website projects and open the terminal. Then execute the following command:
   
      npm i 

5. Right-click on the solution and select "Configure Startup Project". Choose "Multiple Startup Projects" and set all three projects (plantsshop.admin, PlantsShop.API, plantsshop.website) to start.
6. Start the solution.
