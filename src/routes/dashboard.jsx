import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Profile from "./profile";
import globeEndpointPath from "../GlobalVar";

const Dashboard = () => {
    const [admin, setAdmin] = useState([])
    const [error, setError] = useState('')
// set admin after login
const handleSubmit = () => {
    validate();
    var data = JSON.stringify([{
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }]);
    axios({
            method: 'post',
            url: globeEndpointPath+'admin.php',
            data: data,
            config: {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        })
        .then(function (response) {
            //handle success
            if (response.status === 202) {
                // set the state of the user
                setAdmin(response.data)
                localStorage.setItem('admin', response.data);
                alert('Successful signin, page will reload')
                window.location.reload();
            }
            if (response.status === 200) {
                setError('Invalid Credentials')
            }
        })
        .catch(function (response) {
            //handle error
            console.log(response)
        });
}
    // admin validator
    useEffect(() => {
        const checkAdmin = () => {
            const loggedInUser = localStorage.getItem('admin');
            if (loggedInUser) {
                const foundUser = loggedInUser;
                setAdmin(foundUser);
            }
        }
        checkAdmin();
    }, []);
    // Token validation
    const validate = () => {
        var data = JSON.stringify([
            {
              "token": localStorage.getItem('admin')            }
          ]);
        axios({
                method: 'post',
                url: globeEndpointPath+'adminvalidation.php',
                data: data,
                config: {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            })
            .then(function (response) {
                //handle success
                if (response.status === 202) {
                    // set the state of the user
                    //console.log(response.data);
                    setAdmin(response.data.token)
                } else {
                    setAdmin('');
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }
    useEffect(() => {
        validate();
    }, []);

    // apply MUI dark
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    if (admin) { return (<Profile />) }
    return (
        <div id="dashboardLogin">
            <ThemeProvider theme={darkTheme}>
                <Card sx={{ minWidth: 75 }}>
                    <CardContent>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '28ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Stack spacing={2}>
                                <TextField id="username" label="Username" variant="standard" />
                                <TextField id="password" label="Password" variant="standard" type="password" />
                            </Stack>
                        </Box>
                        <CardActions>
                            <Button onClick={() => { handleSubmit(); validate(); }} size="small">Login</Button>
                        </CardActions>
                        {error}
                    </CardContent>
                </Card>
            </ThemeProvider>
        </div>
    );
}
export default Dashboard;