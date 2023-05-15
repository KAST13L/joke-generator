import React, { useState } from "react";
import { JokeType } from "../../common/api/jokes-api";
import { Box, Button, Paper } from "@mui/material";
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

  const { addToFavorite, deleteJoke, refreshJoke } = useActions(jokesThunks);
  const isLoading = status === STATUS.LOADING;

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
          <Button
            disabled={isLoading}
            variant={"contained"}
            onClick={() => deleteJoke(id)}
          >
            <DeleteIcon />
          </Button>
          <Button
            disabled={isLoading}
            variant={"contained"}
            onClick={() => addToFavorite(props)}
          >
            {favorite ? <FavoriteBorderIcon /> : <FavoriteIcon />}
          </Button>
          <Button
            disabled={isLoading}
            variant={"contained"}
            onClick={() => refreshJoke(id)}
          >
            <RefreshIcon />
          </Button>
        </Box>
      )}
    </Paper>
  );
};
