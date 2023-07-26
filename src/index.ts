import express, { Request, Response } from "express";
import http from "http";
import cluster from "cluster";
import { cpus } from "os";
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
import { convertToPdf } from "./Services/Implementations/WordPdfConvertService";
import * as path from "path";
import { PDFNet } from "@pdftron/pdfnet-node";
import * as fs from "fs";

// const producer = new Producer();
// const consumer = new Consumer();

if (cluster.isPrimary) {
  // Fork workers equal to the number of CPU cores
  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  console.log("Number of CPU(s): ", numCPUs);

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
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

  app.use("/generateinvoice", (req: Request, res: Response) => {});

  app.use("/convertfromoffice", async (req: Request, res: Response) => {
    const { filename } = req.query;

    const inputPath = path.resolve(__dirname, `./Files/${filename}.docx`);
    const outputPath = path.resolve(__dirname, `./Files/${filename}.pdf`);

    const convertToPdf = async () => {
      const pdfdoc = await PDFNet.PDFDoc.create();
      await pdfdoc.initSecurityHandler();
      await PDFNet.Convert.toPdf(pdfdoc, inputPath);
      pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    };

    await PDFNet.runWithCleanup(
      convertToPdf,
      "demo:1687870598757:7d91b63b03000000009ef8ab7bef0993b032e25c1e23d8c1baf5355978"
    )
      .then(() => {
        fs.readFile(outputPath, (err, data) => {
          if (err) {
            res.status(500).end(err);
          } else {
            res.setHeader("ContentType", "application/pdf");
            res.sendFile(outputPath);
            //  .send(data);
          }
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.end(err);
      });
  });

  const server = http.createServer(app);

  //const ip = "127.0.0.1";
  const ip = "192.168.137.1";
  const port = 5000;

  server.listen(port, ip, () => {
    console.log(`Server running on http://${ip}:${port}/`);
  });
}
