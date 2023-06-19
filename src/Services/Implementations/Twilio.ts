import {
  TwilioAcctSid,
  TwilioAuthToken,
  TwilioFrom,
} from "../../Utilities/Configs";
import twilio from "twilio";

const accountSid = TwilioAcctSid;
const authToken = TwilioAuthToken;
const from = TwilioFrom;

export const SendPhoneMessage = (to: string, message: string): void => {
  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: from,
      to: to,
    })
    .then((message: any) => {
      // console.log(message.sid);
      console.log("");
    });
};
