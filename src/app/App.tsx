import React from 'react';
import {JokeCardsList} from "../features/JokeCardsList/JokeCardsList";
import {Container, CssBaseline} from "@mui/material";

export const App = () => {
    return (
        <>
            <CssBaseline/>
            <Container sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <JokeCardsList/>
            </Container>
        </>
    );
};