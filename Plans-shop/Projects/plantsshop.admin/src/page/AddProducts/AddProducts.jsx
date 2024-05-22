import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, MenuItem, Snackbar, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";

/*const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;*/



const AddProducts = () => {
    const [apiHost, setApiHost] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios
            .get("/src/assets/Constants.json")
            .then((response) => {
                const apiBaseUrl = response.data.API_HOST;
                setApiHost(apiBaseUrl);
                return axios.get(`${apiBaseUrl}/api/SubCategories/all`);
            })
            .then((response) => {
                setSubcategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching subcategories:", error.response.data);
            });
    }, []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Function to handle saving the product
    const handleSave = async (formData) => {
        try {
            const response = await axios.post(`${apiHost}/api/Products/add`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Product added successfully:", response.data);
            setOpen(true);
        } catch (error) {
            console.error("Error adding product:", error.response.data);
            alert("Error adding product.");
        }
    };

    // Function to handle form submission
    const onSubmit = async (formData) => {
        // Find the selected subcategory object based on ID
        const selectedSubcategory = subcategories.find(
            (subcategory) => subcategory.id === parseInt(formData.Sub_categories_id)
        );


        // Include the selected subcategory object in the payload
        const formDataAll = {
            Name: formData.Name,
            Description: formData.Description,
            Price: parseFloat(formData.Price),
            Rating: parseFloat(formData.Rating),
            Quantity: parseInt(formData.Quantity, 10),
            Image_url: formData.Image_url,
            SubCategories: {
                id: selectedSubcategory.id,
                name: selectedSubcategory.name,
                category_id: selectedSubcategory.category_id,
                category: {
                    id: selectedSubcategory.category.id,
                    name: selectedSubcategory.category.name
                },
                
            },
            sub_categories_id: parseInt(formData.Sub_categories_id, 10),
        };
        // Save the product and reset the form

        handleSave(formDataAll);
        reset();
    };


    // Function to handle snackbar close
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <Box>
            <Header title="ADD PRODUCT" subTitle="Create a New Product" />

            <Box
                onSubmit={handleSubmit(onSubmit)}
                component="AddProducts"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
                noValidate
                autoComplete="off"
            >
                <Stack sx={{ gap: 2 }} direction={"row"}>
                    <TextField
                        error={Boolean(errors.Name)}
                        helperText={errors.Name ? "This field is required" : null}
                        {...register("Name", { required: true })}
                        sx={{ flex: 1 }}
                        label="Product Name"
                        variant="filled"
                    />

                    <TextField
                        error={Boolean(errors.Quantity)}
                        helperText={errors.Quantity ? "This field is required" : null}
                        {...register("Quantity", { required: true })}
                        sx={{ flex: 1 }}
                        label="Quantity"
                        variant="filled"
                        type="number"
                    />
                </Stack>

                <Stack sx={{ gap: 2 }} direction={"row"}>
                    <TextField
                        error={Boolean(errors.Price)}
                        helperText={errors.Price ? "This field is required" : null}
                        {...register("Price", { required: true })}
                        sx={{ flex: 1 }}
                        label="Price"
                        variant="filled"
                        type="number"
                        step="0.01"
                    />

                    <TextField
                        error={Boolean(errors.Rating)}
                        helperText={errors.Rating ? "This field is required" : null}
                        {...register("Rating", { required: true })}
                        label="Rating"
                        sx={{ flex: 1 }}
                        variant="filled"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                    />
                </Stack>

                <TextField
                    error={Boolean(errors.Image_url)}
                    helperText={errors.Image_url ? "This field is required" : null}
                    {...register("Image_url", { required: true })}
                    label="Image Url"
                    variant="filled"
                />

                <TextField
                    error={Boolean(errors.Description)}
                    helperText={errors.Description ? "This field is required" : null}
                    {...register("Description", { required: true })}
                    label="Description"
                    variant="filled"
                    multiline
                    rows={3}
                />

                <TextField
                    variant="filled"
                    id="outlined-select-currency"
                    select
                    label="Subcategory"
                    defaultValue=""
                    {...register("Sub_categories_id", { required: true, transform: (v) => parseInt(v, 10) })}
                    error={Boolean(errors.Sub_categories_id)}
                >
                    {subcategories.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={parseInt(subcategory.id)}>
                            {subcategory.name}
                        </MenuItem>
                    ))}
                </TextField>



                <Box sx={{ textAlign: "right" }}>
                    <Button
                        type="submit"
                        sx={{ textTransform: "capitalize" }}
                        variant="contained"
                    >
                        Create New Product
                    </Button>

                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={open}
                        autoHideDuration={3000}
                        onClose={handleClose}
                    >
                        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
                            Product created successfully
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
};

export default AddProducts;
