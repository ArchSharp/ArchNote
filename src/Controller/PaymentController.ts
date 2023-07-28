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
        // console.log(response);
        // Handle the response as needed
        return res
          .status(200)
          .json(Message(200, "Transaction retreived", response));
      })
      .catch((error) => {
        console.error(error);
        // Handle the error appropriately
      });
  } catch (error) {
    return res.status(404).json("Transaction not retrieved");
  }
};

export const flutterwave_chargecard = async (req: Request, res: Response) => {
  const payload: IFlutterwavePayment = req.body;

  try {
    const paymentResponse = await InitiatePayment(payload);

    const message = Message(
      200,
      "Flutterwave payment initiated successfully",
      paymentResponse
    );
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error:", error.message);

    return res.status(404).json("Flutterwave payment initiation failed");
  }
};
