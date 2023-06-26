import express, { Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import anoteRoute from "./Routes/ANoteRoute";
import schoolRoute from "./Routes/SchoolRoute";
import staffRoute from "./Routes/StaffRoute";
import paymentRoute from "./Routes/PaymentRoute";
import httpRoute from "./Routes/HttpClientRoute";
import Producer from "./Services/Implementations/MessageBroker/Producer";
import Consumer from "./Services/Implementations/MessageBroker/Consumer";

// const producer = new Producer();
// const consumer = new Consumer();

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/anote", anoteRoute);
app.use("/school", schoolRoute);
app.use("/staff", staffRoute);
app.use("/payment", paymentRoute);
app.use("/httpclient", httpRoute);

app.use("/", (req: Request, res: Response) => {
  res.send("Working fine");
});

const server = http.createServer(app);

// const ip = "127.0.0.1";
const ip = "192.168.193.174";
const port = 5000;

server.listen(port, ip, () => {
  console.log(`Server running on http://${ip}:${port}/`);
});
