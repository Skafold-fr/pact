import express from 'express'
import {UserRepository} from "./api/api.js";

const app = express()
const port = process.env.PORT_CONSUMER

const userRepository = new UserRepository(`http://localhost:${process.env.PORT_PROVIDER}`);


app.get('/', async (req, res) => {
    const response = await userRepository.getUsers("1")
    console.log(response)
    res.send(`Hello ${response.firstName}`)
})

app.listen(port, () => {
    console.log(`CONSUMER starting on http://localhost:${process.env.PORT_CONSUMER}`)
})
