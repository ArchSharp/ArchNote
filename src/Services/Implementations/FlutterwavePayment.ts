import axios from "axios";
import forge from "node-forge";
import { flutterwaveEKey, flutterwaveSKey } from "../../Utilities/Configs";
import { IFlutterwavePayment } from "../../Domain/FlutterwaveCardPayload";

const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";
const CHARGES_ENDPOINT = "/charges?type=card";

const axiosInstance = axios.create({
  baseURL: FLUTTERWAVE_BASE_URL,
  headers: {
    Authorization: `Bearer ${flutterwaveSKey}`,
    "Content-Type": "application/json",
  },
});

export const InitiatePayment = async (payload: IFlutterwavePayment) => {
  try {
    // Make a POST request to initiate the payment
    const encryptPayload = encrypt(flutterwaveEKey, payload);
    const response = await axiosInstance.post(CHARGES_ENDPOINT, encryptPayload);
    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

function encrypt(encryptionKey: string, payload: IFlutterwavePayment): string {
  const text = JSON.stringify(payload);
  const cipher = forge.cipher.createCipher(
    "3DES-ECB",
    forge.util.createBuffer(encryptionKey)
  );
  cipher.start({ iv: "" });
  cipher.update(forge.util.createBuffer(text, "utf8"));
  cipher.finish();
  const encrypted = cipher.output;
  return forge.util.encode64(encrypted.getBytes());
}
