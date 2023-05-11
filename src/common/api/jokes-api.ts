import axios from "axios";

const instance = axios.create({
  baseURL: "https://official-joke-api.appspot.com/jokes/",
});

export const jokesAPI = {
  getJokes() {
    return instance.get<JokeAPIType[]>("ten");
  },
  getOneJoke() {
    return instance.get<JokeAPIType>("random");
  },
};

// types

export interface JokeAPIType {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

export type JokeType = JokeAPIType & { favorite: boolean };

export type ResponseServerErrorType = {
  type: string;
  message: string;
};
