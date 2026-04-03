import express from "express";
import { PORT } from "./config";
import { cardsRouter } from "./routers/cards.router";


const server = express();
server.use(express.json());

server.use('/cards', cardsRouter)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});