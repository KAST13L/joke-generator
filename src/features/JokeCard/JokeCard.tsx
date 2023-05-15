import React, { useState } from "react";
import { JokeType } from "../../common/api/jokes-api";
import { Box, Button, Paper, Tooltip } from "@mui/material";
import { STATUS } from "../../common/utils/variables";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RefreshIcon from "@mui/icons-material/Refresh";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import s from "./JokeCard.module.scss";
import { useSelector } from "react-redux";
import { selectStatus } from "../../app/selectors/selectors";
import { useActions } from "../../common/hooks/hooks";
import { jokesThunks } from "../JokeCardsList/jokes-reducer";

export const JokeCard: React.FC<JokeType> = (props) => {
  const { type, setup, id, punchline, favorite } = props;

  const status = useSelector(selectStatus);
  const [isShow, setIsShow] = useState<boolean>(false);

  const { toggleIsFavorite, deleteJoke, refreshJoke } = useActions(jokesThunks);
  const isLoading = status === STATUS.LOADING;

  const buttonForJoke = (
    title: string,
    icon: JSX.Element,
    callback: () => void
  ) => {
    return (
      <Tooltip title={title} arrow>
        <Button variant={"contained"} disabled={isLoading} onClick={callback}>
          {icon}
        </Button>
      </Tooltip>
    );
  };

  return (
    <Paper
      elevation={8}
      className={s.jokeCard}
      sx={{ backgroundColor: favorite ? "#f4acf8" : "white" }}
      onMouseEnter={() => setIsShow(() => true)}
      onMouseLeave={() => setIsShow(() => false)}
    >
      <Box className={s.topField}>
        <div>Type: {type}</div>
        <div>ID: {id}</div>
      </Box>
      <Box sx={{ margin: "5px" }}>
        <div style={{ color: "blueviolet" }}>Setup:</div>
        <div>{setup}</div>
      </Box>
      <Box sx={{ margin: "5px 5px 40px 5px" }}>
        <div style={{ color: "blueviolet" }}>Punchline:</div>
        <div>{punchline}</div>
      </Box>
      {isShow && (
        <Box className={s.buttonsList}>
          {buttonForJoke("delete", <DeleteIcon />, () => deleteJoke(id))}
          {buttonForJoke(
            favorite ? "remove from favorite" : "add to favorite",
            favorite ? <FavoriteBorderIcon /> : <FavoriteIcon />,
            () => toggleIsFavorite(props)
          )}
          {buttonForJoke("refresh", <RefreshIcon />, () => refreshJoke(id))}
        </Box>
      )}
    </Paper>
  );
};
