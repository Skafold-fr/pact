import {server} from "./src/http/server.js";

const port = process.env.PORT_PROVIDER

server.listen(port, () => {
    console.log(`PROVIDER starting on http://localhost:${process.env.PORT_PROVIDER}`)

})
