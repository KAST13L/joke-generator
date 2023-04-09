import React, {useEffect} from 'react';
import {JokeCard} from "../JokeCard/JokeCard";
import {fetchJokes} from "./jokes-reducer";
import {Box, Button, Grid} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {STATUS} from "../../variables";
import s from './JokeCardsList.module.scss'

export const JokeCardsList = () => {

    const dispatch = useAppDispatch()
    const jokes = useAppSelector((state) => state.jokes.jokes)
    const status = useAppSelector(state => state.app.status)

    useEffect(() => {
        dispatch(fetchJokes())
    }, [dispatch])

    return (
        <Box className={s.jokeCardsList}>
            <Grid container>
                {jokes.map(j => <JokeCard key={j.id} {...j}/>)}
            </Grid>
            <Box className={s.button} >
                <Button variant={'contained'} disabled={status === STATUS.LOADING} onClick={() => dispatch(fetchJokes())}>LOAD MORE</Button>
            </Box>
        </Box>
    );
};

