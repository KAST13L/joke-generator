import axios from "axios";

const instance = axios.create({
    baseURL: 'https://official-joke-api.appspot.com/jokes/',
})

export const jokesAPI = {
    getJokes() {
        return instance.get<JokeType[]>('ten')
    },
    getOneJoke() {
        return instance.get<JokeType>('random')
    }
}

export interface JokeType {
    id: number
    type: string
    setup: string
    punchline: string
}