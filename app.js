import express from 'express';
import "dotenv/config";
import mainRouter from "./routes/index.js";
import morgan from "morgan";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(mainRouter);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
