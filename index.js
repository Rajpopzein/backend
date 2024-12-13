import express,{json} from 'express';
import {createServer} from 'http';
import { connectDB } from './mongoss/mongoConnection.js';
import  initializeSocket  from './socket/chat.js';
import indxeRoute from './router/indexRouter.js';
import cors from "cors";

const app = express();
const server = createServer(app);
app.use(cors());
app.use(json());
connectDB()
initializeSocket(server)
const port = 3000;

app.use("/",indxeRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});