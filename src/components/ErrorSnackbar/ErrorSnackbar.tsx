import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {setAppError, setAppSuccess} from "../../app/app-reducer";
import {selectError, selectSuccess} from "../../app/selectors";

export function ErrorSnackbar() {
    const error = useSelector(selectError)
    const success = useSelector(selectSuccess)

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
