import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Paper, Stack, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authManager from '../utils/auth';
import background from '../assets/images/background.png'

const Login: React.FC = () => { 
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await authManager.login({
                username,
                password,
            });
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Grid container sx={{ height: '100vh', margin: 0 }}>
            <Grid item xs={4} sm={4} md={4} lg={4} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                <Box alignContent={"center"} justifyContent="center" sx={{ height: 'auto' }}>
                    <Stack spacing={2} padding={2} width={300}>
                        <Typography variant="h2" component="h2" fontWeight={"bold"} align="center">
                            Login
                        </Typography>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Stack>
                </Box>
            </Grid>
            <Grid item sx={{ height: '100%', margin: 0 }} xs={8} sm={8} md={8} lg={8}>
                <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                    {/* Fit content */}
                    <img src={background} alt="background" style={{
                        // fit content
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        // objectPosition: 'center',
                    }}/>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
