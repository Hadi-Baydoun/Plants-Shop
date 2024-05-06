import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, MenuItem, Snackbar, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";

const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const data = [
    {
        value: "Admin",
        label: "Admin",
    },
    {
        value: "Manger",
        label: "Manger",
    },
    {
        value: "User",
        label: "User",
    },
];

const Form = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const onSubmit = () => {
        handleClick();
    };

    return (
        <Box>
            <Header title="ADD PRODUCT" subTitle="Create a New Product" />

            <Box
                onSubmit={handleSubmit(onSubmit)}
                component="form"
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
                        error={Boolean(errors.firstName)}
                        helperText={
                            errors.firstName
                                ? "This field is required & min 3 character"
                                : null
                        }
                        {...register("firstName", { required: true, minLength: 3 })}
                        sx={{ flex: 1 }}
                        label="Product Name"
                        variant="filled"
                    />

                    <TextField
                        error={Boolean(errors.lastName)}
                        helperText={
                            errors.lastName
                                ? "This field is required & min 3 character"
                                : null
                        }
                        {...register("lastName", { required: true, minLength: 3 })}
                        sx={{ flex: 1 }}
                        label="Quantity"
                        variant="filled"
                    />
                </Stack>

                <Stack sx={{ gap: 2 }} direction={"row"}>

                    <TextField
                        error={Boolean(errors.email)}
                        helperText={
                            errors.email
                                ? "Please provide a valid email address"
                                : null
                        }
                        {...register("email", { required: true, pattern: regEmail })}
                        sx={{ flex: 1 }}
                        label="Price"
                        variant="filled"
                    />

                    <TextField
                        error={Boolean(errors.ContactNumber)}
                        helperText={
                            errors.ContactNumber
                                ? "Please provide a valid Phone number"
                                : null
                        }
                        {...register("ContactNumber", {
                            required: true,
                            pattern: phoneRegExp,
                        })}
                        label="Rating"
                        sx={{ flex: 1 }}
                        variant="filled"
                    />
                </Stack>
                <TextField label="Image Url" variant="filled" />




                <TextField label="Description" variant="filled" />

                <TextField
                    variant="filled"
                    id="outlined-select-currency"
                    select
                    label="Category"
                    defaultValue="User"
                >
                    {data.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
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

export default Form;
