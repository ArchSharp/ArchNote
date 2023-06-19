import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import anoteRoute from "./Routes/ANoteRoute";
import schoolRoute from "./Routes/SchoolRoute";
import staffRoute from "./Routes/StaffRoute";
import paymentRoute from "./Routes/PaymentRoute";
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

const server = http.createServer(app);

const port = 5000;
const url = `http://localhost:${port}/`;

server.listen(port, () => {
  console.log(`Server running on ${url}`);
});
