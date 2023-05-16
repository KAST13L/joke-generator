import React, { useEffect } from "react";
import { JokeCard } from "../JokeCard/JokeCard";
import { Box, Button, Grid } from "@mui/material";
import { useActions } from "../../common/hooks/hooks";
import { STATUS } from "../../common/utils/variables";
import s from "./JokeCardsList.module.scss";
import { useSelector } from "react-redux";
import { selectJokes, selectStatus } from "../../app/selectors/selectors";
import { jokesThunks } from "./jokes-reducer";

export const JokeCardsList = () => {
  const jokes = useSelector(selectJokes);
  const status = useSelector(selectStatus);

  const { fetchJokes } = useActions(jokesThunks);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  return (
    <Box className={s.jokeCardsList}>
      <Grid container>
        {jokes.map((j) => (
          <JokeCard key={j.id} {...j} />
        ))}
      </Grid>
      <Box className={s.button}>
        <Button
          variant={"contained"}
          disabled={status === STATUS.LOADING}
          onClick={() => fetchJokes()}
        >


          LOAD MORE
        </Button>
      </Box>
    </Box>
  );
};
