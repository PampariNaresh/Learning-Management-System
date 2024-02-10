import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import userRoutes from './routes/user.routes.js'
const app = express();


app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    creditionals: true
}))
app.use(cookieParser());
app.use(morgan("dev"));

import errorMiddleware from "./middlewares/error.middleware.js"

app.use('/ping', (req, res) => {
    res.send("Pong");
})
app.use("/api/v1/user", userRoutes);

app.all("*", (req, res) => {
    res.status(404).send("OOPS|| 4040 page not found");
})


//generic middleware
app.use(errorMiddleware)
export default app;