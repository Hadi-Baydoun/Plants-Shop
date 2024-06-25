import { useState, useEffect } from "react";
import axios from "axios";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    SnackbarContent,
    TextField,
    useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLocation } from "react-router-dom";
import { API_HOST } from '../../assets/constants';

export default function SignInForm() {
    const theme = useTheme();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [openError, setOpenError] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiHost, setApiHost] = useState("");



    const paperStyle = {
        padding: 40,
        height: "55vh",
        width: 440,
        margin: "20px auto",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    };
    const avatarStyle = { backgroundColor: "#1bbd7e" };
    const btnstyle = { margin: "8px 0" };

    const handleSignIn = () => {
        axios
            .get(`${API_HOST}/api/Admin/all`)
            .then((response) => {
                const admins = response.data;
                const matchedAdmin = admins.find(
                    (admin) => admin.name === username && admin.password === password
                );
                if (matchedAdmin) {
                    console.log("Login successful, redirecting...");
                    window.location.href = "/dashboard";
                } else {
                    console.log("Login failed, credentials do not match.");
                    setOpenError(true);
                    setLoginFailed(true);
                }
            })
            .catch((error) => {
                console.error("Error during sign-in:", error.response.data);
                setOpenError(true);
                setLoginFailed(true);
            });
    };

    const handleCloseError = () => {
        setOpenError(false);
    };
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <Grid>
            <Grid align="center">
                <Avatar style={avatarStyle}>
                    <LockOutlinedIcon />
                </Avatar>
                <h2>Sign In</h2>
            </Grid>
            <Paper
                elevation={10}
                style={paperStyle}
                sx={{ color: theme.palette.info.light }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, justifyContent: "center" }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        required
                        value={username}
                        error={loginFailed}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: "transparent" }, // Transparent background color
                        }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        error={loginFailed}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                        color="inherit"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    style={btnstyle}
                    fullWidth
                    onClick={handleSignIn}
                >
                    Sign in
                </Button>
            </Paper>

            <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <SnackbarContent
                    style={{ backgroundColor: "#f44336", color: "wheat" }}
                    message="Invalid Username or Password"
                />
            </Snackbar>
        </Grid>
    );
}
