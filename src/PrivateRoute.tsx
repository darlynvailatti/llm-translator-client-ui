import { Box, IconButton, Tooltip } from "@mui/material";
import authManager from "./utils/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logout, StackedBarChart } from "@mui/icons-material";

export const PrivateRoute: React.FC<{ component: React.FC }> = ({ component: Component, ...rest }) => {
    const navigate = useNavigate()
    const isAuthenticated = authManager.isAuthenticated();

    const handleLogout = () => {
        authManager.logout();
        navigate("/login");
    };

    return isAuthenticated ?
        <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>

                <Box
                    component="aside"
                    sx={{
                        width: 56,
                        borderRight: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                    }}
                >

                    {/* Endpoints menu item */}
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Tooltip title="Endpoints" placement="right">
                            <IconButton
                                title="Endpoints"
                                sx={{
                                    mb: "auto",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                <StackedBarChart />
                            </IconButton>
                        </Tooltip>
                    </Link>

                    {/* Logout button at the bottom */}
                    <Tooltip title="Logout" placement="right">
                        <IconButton
                            title="Logout" onClick={handleLogout}>
                            <Logout />
                        </IconButton>
                    </Tooltip>

                </Box>

            </Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Component {...rest} />
            </Box>
        </Box>
        : <Navigate to="/login" />;
};