import express from "express";
import { json } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
