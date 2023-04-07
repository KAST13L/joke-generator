import React, {useState} from 'react';
import {JokeType} from "../../api/jokes-api";
import {Box, Paper} from "@mui/material";
import {addToFavorite, deleteJoke, refreshJoke} from "../JokeCardsList/jokes-reducer";
import {useAppDispatch} from "../../hooks/hooks";

export const JokeCard: React.FC<JokeType> = ({type, setup, id, punchline}) => {
    const dispatch = useAppDispatch()
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
                   margin: '5px'
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
            <Box sx={{margin: '5px 5px 20px 5px'}}>
                <div>Punchline:</div>
                <div>{punchline}</div>
            </Box>
            {isShow && <Box sx={{position: 'absolute', bottom: '5px'}}>
                <button onClick={deleteJokeHandler}>delete</button>
                <button onClick={addToFavoriteHandler} >add</button>
                <button onClick={refreshJokeHandler}>refresh</button>
            </Box>}
        </Paper>
    );
};

