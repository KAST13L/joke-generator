import React from 'react';
import {JokeCardsList} from "../features/JokeCardsList/JokeCardsList";
import {Container, CssBaseline} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Header} from "../features/Header/Header";
import s from './App.module.scss'

export const App = () => {
    return (
        <>
            <CssBaseline/>
            <ErrorSnackbar/>
            <Header/>
            <Container className={s.app}>

                <JokeCardsList/>
            </Container>
        </>
    );
};