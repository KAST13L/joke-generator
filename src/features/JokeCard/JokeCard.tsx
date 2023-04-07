import React, {useState} from 'react';
import {JokeType} from "../../api/jokes-api";
import {Box, Button, Paper} from "@mui/material";
import {addToFavorite, deleteJoke, refreshJoke} from "../JokeCardsList/jokes-reducer";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {STATUS} from "../../variables";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export const JokeCard: React.FC<JokeType> = ({type, setup, id, punchline, favorite}) => {
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.app.status)
    const [isShow, setIsShow] = useState<boolean>(false)

    const deleteJokeHandler = () => {
        dispatch(deleteJoke(id))
    }
    const refreshJokeHandler = () => {
        dispatch(refreshJoke(id))
    }

    const addToFavoriteHandler = () => {
        dispatch(addToFavorite(id))
    }

    return (
        <Paper elevation={8}
               sx={{
                   width: '220px',
                   position: 'relative',
                   padding: '10px',
                   margin: '5px',
                   borderRadius: '10px',
                   backgroundColor: favorite ? '#f4acf8' : 'white'
               }}
               onMouseEnter={() => setIsShow(() => true)}
               onMouseLeave={() => setIsShow(() => false)}>
            <Box
                sx={{display: 'flex', justifyContent: 'space-between', padding: '5px 0'}}>
                <div>Type:{type}</div>

                <div>ID: {id}</div>
            </Box>
            <Box sx={{margin: '5px'}}>
                <div>Setup:</div>
                <div>{setup}</div>
            </Box>
            <Box sx={{margin: '5px 5px 30px 5px'}}>
                <div>Punchline:</div>
                <div>{punchline}</div>
            </Box>
            {isShow && <Box sx={{
                position: 'absolute',
                bottom: '5px',
                display: 'flex',
                justifyContent: 'space-evenly',
                width: '200px'
            }}>
                <Button disabled={status === STATUS.LOADING} variant={'contained'}
                        onClick={deleteJokeHandler}><DeleteIcon/></Button>
                {!favorite &&
                    <Button disabled={status === STATUS.LOADING} variant={'contained'}
                            onClick={addToFavoriteHandler}><AddIcon/></Button>}
                <Button disabled={status === STATUS.LOADING} variant={'contained'}
                        onClick={refreshJokeHandler}><RefreshIcon/></Button>
            </Box>}
        </Paper>
    );
};

