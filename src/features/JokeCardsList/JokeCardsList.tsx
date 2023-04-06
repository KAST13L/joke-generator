import React, {useEffect} from 'react';
import {JokeCard} from "../JokeCard/JokeCard";
import {fetchJokes} from "./jokes-reducer";
import {Box, Grid} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";

export const JokeCardsList = () => {

    const dispatch = useAppDispatch()
    const jokes = useAppSelector((state) => state.jokes.jokes)

    useEffect(() => {
        dispatch(fetchJokes())
    }, [dispatch])

    return (
        <Box sx={{display: 'flex-row', marginTop: '15px'}}>
            <Grid container>
                {jokes.map(j => <JokeCard key={j.id} {...j}/>)}
            </Grid>
            <Box sx={{textAlign: 'center', padding: '30px'}}>
                <button onClick={() => dispatch(fetchJokes())}>load more</button>
            </Box>
        </Box>
    );
};

