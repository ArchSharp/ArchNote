import { paystacksecret } from "../../Utilities/Configs";
import * as https from "https";

export const paystackPayment = (email: string, amount: string) => {
  const params = JSON.stringify({
    email: email,
    amount: amount,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystacksecret}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https
      .request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const response = JSON.parse(data);
          resolve(response);
        });
      })
      .on("error", (error) => {
        reject(error);
      });

    req.write(params);
    req.end();
  });
};

export const paystackverifypayment = (reference: string) => {
  const encRef = encodeURIComponent(reference);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${encRef}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystacksecret}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const vResponse = JSON.parse(data);
        resolve(vResponse);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};
