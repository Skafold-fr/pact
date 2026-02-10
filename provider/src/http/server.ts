import express from 'express'

const app = express()

type UserV1 = {
    id: string,
    firstName: string
}

type UserV2 = {
    id: string,
    name: {
        first: string;
    }
}

app.get('/users/:id', (req, res) => {
    const user: UserV1 = {id: "1", firstName: 'John Doe'}
    // const user: UserV2 = {id: 2, name: {first: 'Dalyn Amendola'}}

    res.json(user)
})


export {app}
