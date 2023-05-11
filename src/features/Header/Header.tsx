import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { AppBar, Box } from "@mui/material";
import s from "./Header.module.scss";
import { useSelector } from "react-redux";
import {
  selectJokesTotalCount,
  selectRepeatingIdsOfJokesList,
  selectStatus,
} from "../../app/selectors/selectors";

export const Header = () => {
  const status = useSelector(selectStatus);
  const repeatingIdsOfJokesList = useSelector(selectRepeatingIdsOfJokesList);
  const jokesTotalCount = useSelector(selectJokesTotalCount);

  return (
    <AppBar color="default" className={s.appBar}>
      <span className={s.linearProgress}>
        {status === "loading" && <LinearProgress />}
      </span>
      <Box className={s.text}>
        <div>Number of re-received jokes: {repeatingIdsOfJokesList}</div>
        <div>Total number of jokes: {jokesTotalCount}</div>
      </Box>
    </AppBar>
  );
};
