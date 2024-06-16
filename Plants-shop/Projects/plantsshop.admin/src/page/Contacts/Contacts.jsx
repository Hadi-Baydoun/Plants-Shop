import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { Box, Stack, styled, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

const Search = styled('div')(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.dark, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.dark, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

export default function Contacts() {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomerData = () => {
        axios.get("/src/assets/Constants.json")
            .then((response) => {
                const apiBaseUrl = response.data.API_HOST;
                return axios.get(`${apiBaseUrl}/api/Customer/all`);
            })
            .then((response) => {
                const customersData = response.data;

                const dynamicColumns = Object.keys(customersData[0] || {})
                    .filter(key => key !== 'password' && key !== 'id')  
                    .map((field) => ({
                        field: field,
                        headerName: field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        flex: 1,
                    }));

                const idColumn = {
                    field: 'id',
                    headerName: 'ID',
                    width: 60
                };

                setColumns([idColumn, ...dynamicColumns]);
                setRows(customersData);
            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });
    };

    useEffect(fetchCustomerData, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRows = rows.filter((row) => {
        // Convert all fields to strings for a uniform search operation
        return Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <Box style={{ height: 500, width: "98%", margin: "auto" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Header
                    title="CUSTOMERS"
                    subTitle="List of Customers for Future Reference"
                />
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search..."
                        inputProps={{ "aria-label": "search" }}
                        onChange={handleSearch}
                        
                    />
                </Search>
            </Stack>
            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </Box>
    );
}