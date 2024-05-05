import { useEffect, useState } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from "axios";

function App() {

   
    const [apiHost, setApiHost] = useState("");

    useEffect(() => {
        axios.get("/src/assets/Constants.json")
            .then(response => {
                setApiHost(response.data.API_HOST);
            })
            .catch(error => {
                console.error("Error fetching the API host:", error);
            });
    }, []);

    
  
    return (
        <div>{apiHost}</div>
    );
    
    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setForecasts(data);
    }
}

export default App;