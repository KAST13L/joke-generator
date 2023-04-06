import React, {useEffect} from 'react';
import {JokeCard} from "../JokeCard/JokeCard";
import {useDispatch, useSelector} from "react-redux";
import {fetchJokes} from "./jokes-reducer";
import {RootStateType} from "../../app/store";
import {Box, Grid} from "@mui/material";

export const JokeCardsList = () => {

    const dispatch = useDispatch()
    const jokes = useSelector((state: RootStateType) => state.jokes.jokes)

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchJokes())
    }, [dispatch])

    return (
        <Box sx={{display:'flex', marginTop:'15px'}}>
            <Grid container >
                {jokes.map(j => <JokeCard key={j.id} {...j}/>)}
            </Grid>
        </Box>
    );
};

