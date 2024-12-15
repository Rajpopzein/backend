import express,{json} from 'express';
import {createServer} from 'http';
import { connectDB } from './mongoss/mongoConnection.js';
import  initializeSocket  from './socket/chat.js';
import indxeRoute from './router/indexRouter.js';
import cors from "cors";
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

config()

const app = express();
const server = createServer(app);
app.use(cors());
app.use(json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(process.env.DBConnection)
initializeSocket(server)
const port = 3000;

// console.log(process);

app.use("/",indxeRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});