import React, {useEffect} from 'react';
import {JokeCard} from "../JokeCard/JokeCard";
import {fetchJokes} from "./jokes-reducer";
import {Box, Button, Grid} from "@mui/material";
import {useAppDispatch} from "../../common/hooks/hooks";
import {STATUS} from "../../common/utils/variables";
import s from './JokeCardsList.module.scss'
import {useSelector} from "react-redux";
import {selectJokes, selectStatus} from "../../app/selectors/selectors";

export const JokeCardsList = () => {

    const dispatch = useAppDispatch()
    const jokes = useSelector(selectJokes)
    const status = useSelector(selectStatus)

    useEffect(() => {
        dispatch(fetchJokes())
    }, [dispatch])

    return (
        <Box className={s.jokeCardsList}>
            <Grid container>
                {jokes.map(j => <JokeCard key={j.id} {...j}/>)}
            </Grid>
            <Box className={s.button}>
                <Button variant={'contained'} disabled={status === STATUS.LOADING}
                        onClick={() => dispatch(fetchJokes())}>LOAD MORE</Button>
            </Box>
        </Box>
    );
};

