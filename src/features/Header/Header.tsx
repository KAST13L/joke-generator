import React from 'react';
import LinearProgress from "@mui/material/LinearProgress";
import {AppBar, Box} from "@mui/material";
import {useAppSelector} from "../../hooks/hooks";
import s from "./Header.module.scss";

export const Header = () => {
    const status = useAppSelector(state => state.app.status)
    const repeatingIdsOfJokesList = useAppSelector((state) => state.jokes.repeatingIdsOfJokesList)
    const jokesTotalCount = useAppSelector(state => state.jokes.jokes.length)

    return (
        <AppBar color='default' className={s.appBar}>
            <span className={s.linearProgress}>{status === 'loading' &&
                <LinearProgress/>}</span>
            <Box className={s.text}>
                <div>
                    Number of re-received jokes: {repeatingIdsOfJokesList}
                </div>
                <div>
                    Total number of jokes: {jokesTotalCount}
                </div>
            </Box>
        </AppBar>
    );
};

