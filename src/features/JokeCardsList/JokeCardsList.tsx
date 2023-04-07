import React, {useEffect} from 'react';
import {JokeCard} from "../JokeCard/JokeCard";
import {fetchJokes} from "./jokes-reducer";
import {Box, Grid} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";

export const JokeCardsList = () => {

    const dispatch = useAppDispatch()
    const jokes = useAppSelector((state) => state.jokes.jokes)
    const repeatingIdsOfJokesList = useAppSelector((state) => state.jokes.repeatingIdsOfJokesList)

    useEffect(() => {
        dispatch(fetchJokes())
    }, [dispatch])

    return (
        <Box sx={{display: 'flex-row', marginTop: '15px'}}>
            <Box sx={{textAlign: 'center', padding: '30px'}}>
                <button onClick={() => dispatch(fetchJokes())}>load more</button>
                the number of re-received jokes: {repeatingIdsOfJokesList}
            </Box>
            <Grid container>
                {jokes.map(j => <JokeCard key={j.id} {...j}/>)}
            </Grid>
        </Box>
    );
};

