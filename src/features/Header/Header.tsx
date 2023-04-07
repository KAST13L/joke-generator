import React from 'react';
import LinearProgress from "@mui/material/LinearProgress";
import {AppBar, Box} from "@mui/material";
import {useAppSelector} from "../../hooks/hooks";

export const Header = () => {
    const status = useAppSelector(state => state.app.status)
    const repeatingIdsOfJokesList = useAppSelector((state) => state.jokes.repeatingIdsOfJokesList)

    return (
        <AppBar color='default' sx={{height:'33px'}}>
            <span style={{height:'1px'}}>{status === 'loading' && <LinearProgress/>}</span>
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', fontSize:'20px'}}>The number of re-received jokes: {repeatingIdsOfJokesList}</Box>
        </AppBar>
    );
};

