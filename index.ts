import express from "express";
import { json } from "express";
import dotenv from "dotenv";
import {connect} from "./config/database";
import User from "./routes/User";

dotenv.config();

const app = express();

app.use(json());
app.use(User);

const PORT = process.env.PORT;

connect();

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
