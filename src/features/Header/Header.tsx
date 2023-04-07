import React from 'react';
import LinearProgress from "@mui/material/LinearProgress";
import {AppBar} from "@mui/material";
import {useAppSelector} from "../../hooks/hooks";

export const Header = () => {
    const status = useAppSelector(state => state.app.status)

    return (
        <AppBar color='default' sx={{height:'4px'}}>
            <span>{status === 'loading' && <LinearProgress/>}</span>
        </AppBar>
    );
};

