import { Request, Response } from "express";
import { IPayment } from "../Domain/PayStack";
import {
  paystackPayment,
  paystackverifypayment,
} from "../Services/Implementations/PayStackPayment";
import { Message } from "../Response/IResponse";
import { IFlutterwavePayment } from "../Domain/FlutterwaveCardPayload";
import { InitiatePayment } from "../Services/Implementations/FlutterwavePayment";

export const makepaystack_payment = (req: Request, res: Response) => {
  try {
    const payload: IPayment = req.body;
    // const response = paystackverifypayment(reference);
    console.log(payload.Email);
    paystackPayment(payload.Email, payload.Amount)
      .then((response: any) => {
        // console.log(response);
        // Handle the response as needed
        return res
          .status(200)
          .json(Message(200, "Payment link received", response));
      })
      .catch((error: any) => {
        console.error(error);
        // Handle the error appropriately
      });
  } catch (error) {
    return res.status(404).json("Transaction not retrieved");
  }
};

export const verifypaystack_payment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    // const response = paystackverifypayment(reference);
    paystackverifypayment(reference)
      .then((response) => {
        return res
          .status(200)
          .json(Message(200, "Transaction retreived", response));
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    return res.status(404).json("Transaction not retrieved");
  }
};

export const flutterwave_chargecard = async (req: Request, res: Response) => {
  try {
    const payload: IFlutterwavePayment = req.body;
    InitiatePayment(payload)
      .then((response) => {
        const message = Message(
          200,
          "Flutterwave payment initiated successfully",
          response
        );
        return res.status(200).json(message);
      })
      .catch((error) => {
        return res.status(404).json("Error initiating payment:" + error);
      });
  } catch (error) {
    return res.status(404).json("Flutterwave payment error: " + error.message);
  }
};
