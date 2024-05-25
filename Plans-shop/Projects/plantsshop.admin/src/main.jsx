import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import App from "./App";
import Dashboard from "./page/Dashboard/Dashboard";
import Team from "./page/Team/Team";
import Invoices from "./page/Invoices/Invoices";
import Contacts from "./page/Contacts/Contacts";
import AddProducts from "./page/AddProducts/AddProducts";
import FAQ from "./page/FAQ/FAQ";
import Calendar from "./page/Calendar/Calendar";
import NotFound from "./page/notFound/NotFound";
import SignInForm from "./page/signIn/SignInForm";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<SignInForm />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="team" element={<Team />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="addProduct" element={<AddProducts />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="faq" element={<FAQ />} />

            <Route path="*" element={<NotFound />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
