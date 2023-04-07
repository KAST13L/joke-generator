import React from 'react';
import {JokeCardsList} from "../features/JokeCardsList/JokeCardsList";
import {Container, CssBaseline} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Header} from "../features/Header/Header";

export const App = () => {
    return (
        <>
            <CssBaseline/>
            <ErrorSnackbar/>
            <Header/>
            <Container
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <JokeCardsList/>
            </Container>
        </>
    );
};