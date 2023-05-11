import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { appActions } from "../../../app/app-reducer";
import { selectError, selectSuccess } from "../../../app/selectors/selectors";
import { useActions } from "../../hooks/hooks";

export function ErrorSnackbar() {
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const { setAppError, setAppSuccess } = useActions(appActions);

  const severity: AlertColor = error ? "error" : "success";
  const message = error ? error : success;
  const handleClose = async () => {
    success && setAppSuccess({ success: null });
    error && setAppError({ error: null });
  };

  const isOpen: boolean = !!error || !!success;

  return (
    <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
      <Alert variant="filled" severity={severity} sx={{ width: "600px" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
