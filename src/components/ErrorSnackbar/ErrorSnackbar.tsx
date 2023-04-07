import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert';
import {useDispatch} from 'react-redux';
import {useAppSelector} from "../../hooks/hooks";
import {setAppError, setAppSuccess} from "../../app/app-reducer";

export function ErrorSnackbar() {
    const error = useAppSelector(state => state.app.error)
    const success = useAppSelector(state => state.app.success)

    const dispatch = useDispatch();

    const severity: AlertColor = error ? 'error' : 'success'
    const message = error ? error : success
    const visualTime = error ? 6000 : 3000

    const handleClose = async () => {
        success && dispatch(setAppSuccess({success: null}))
        error && dispatch(setAppError({error: null}))
    }

    const isOpen: boolean = !!error || !!success

    return (<Snackbar open={isOpen} autoHideDuration={visualTime} onClose={handleClose}>
            <Alert variant='filled' severity={severity} sx={{width: '600px'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}
