import React, {useState} from 'react';
import {JokeType} from "../../common/api/jokes-api";
import {Box, Button, Paper} from "@mui/material";
import {addToFavorite, deleteJoke, refreshJoke} from "../JokeCardsList/jokes-reducer";
import {useAppDispatch} from "../../common/hooks/hooks";
import {STATUS} from "../../common/utils/variables";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import s from './JokeCard.module.scss';
import {useSelector} from "react-redux";
import {selectStatus} from "../../app/selectors/selectors";

export const JokeCard: React.FC<JokeType> = ({type, setup, id, punchline, favorite}) => {
    const dispatch = useAppDispatch()
    const status = useSelector(selectStatus)
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
               className={s.jokeCard}
               sx={{backgroundColor: favorite ? '#f4acf8' : 'white'}}
               onMouseEnter={() => setIsShow(() => true)}
               onMouseLeave={() => setIsShow(() => false)}>
            <Box className={s.topField}>
                <div>Type: {type}</div>
                <div>ID: {id}</div>
            </Box>
            <Box sx={{margin: '5px'}}>
                <div style={{color: "blueviolet"}}>Setup:</div>
                <div>{setup}</div>
            </Box>
            <Box sx={{margin: '5px 5px 40px 5px'}}>
                <div style={{color: "blueviolet"}}>Punchline:</div>
                <div>{punchline}</div>
            </Box>
            {isShow && <Box className={s.buttonsList}>
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

