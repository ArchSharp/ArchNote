import { ISchoolOwner } from "../Domain/SchoolOwner";
import {
  AddToDB,
  FirstOrDefault,
  Remove,
  Update,
} from "../Infrastructure/Repository";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Message } from "../Response/IResponse";
import {
  CreateSuccess,
  EmailPinSent,
  InternalError,
  InvalidEmail,
  LoginSuccess,
  PhonePinSent,
  SchoolDeleted,
  SchoolIsExist,
  SchoolNotFound,
  UpdateSuccess,
  WrongPassword,
  userNotFound,
} from "../Response/Responses";
import { ISignIn } from "../Domain/SignIn";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Services/Implementations/JwtService";
import { jwtrefreshsecret } from "../Utilities/Configs";
import { verify } from "jsonwebtoken";
import { generateSixDigitNumber } from "../Utilities/RandomNumber";
import { SendEmailMessage } from "../Services/Implementations/NodeMailer";
import { SendPhoneMessage } from "../Services/Implementations/Twilio";

const schTab = "SchoolOwner";
const dbId = "CacRegNumber";
const rtokTab = "RefreshToken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const newSchool: ISchoolOwner = req.body;
  try {
    const id = newSchool.CacRegNumber;
    var isSchoolExist = await FirstOrDefault(schTab, dbId, id);
    if (isSchoolExist != null) {
      const error = Message(400, SchoolIsExist);
      res.status(400).json(error);
    } else {
      const hash = await bcrypt.hash(newSchool.Password, 10);
      newSchool.Password = hash;
      var response: ISchoolOwner = await AddToDB(schTab, newSchool);
      const success = Message(200, CreateSuccess, response);
      res.status(200).json(success);
    }
  } catch (error) {
    const err = Message(500, InternalError);
    res.status(500).json(err);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const payload: ISignIn = req.body;
    var isUserExist: ISchoolOwner = await FirstOrDefault(
      schTab,
      "Email",
      payload.Email
    );
    if (isUserExist == null) {
      return res.status(404).json(Message(404, userNotFound));
    }
    const isMatched = await bcrypt.compare(
      payload.Password,
      isUserExist.Password
    );
    if (!isMatched) {
      const error = Message(400, WrongPassword);
      return res.status(400).json(error);
    }
    const jwtPayLoad = { Email: isUserExist.Email, Id: isUserExist.Id };
    const refreshtoken = generateRefreshToken(jwtPayLoad);
    const accesstoken = generateAccessToken(jwtPayLoad);
    //save refresh token
    const newRToken = { RefreshToken: refreshtoken };
    await AddToDB(rtokTab, newRToken);
    //await producer.publishMessage("testing");
    //------------------
    const tokens = {
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    };
    const success = Message(200, LoginSuccess, isUserExist, tokens);
    return res.status(200).json(success);
  } catch (error) {
    console.log(error);
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const editedSch: ISchoolOwner = req.body;
    const isSchoolExist = await FirstOrDefault(schTab, dbId, id);
    if (isSchoolExist == null) {
      const error = Message(400, SchoolNotFound);
      res.status(400).json(error);
    } else {
      const update = await Update(schTab, dbId, id, editedSch);
      const response = Message(200, UpdateSuccess, update);
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const ddelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isSchoolExist = await FirstOrDefault(schTab, dbId, id);

    if (isSchoolExist == null) {
      const error = Message(400, SchoolNotFound);
      res.status(400).json(error);
    } else {
      await Remove(schTab, dbId, id);
      res.status(200).json(SchoolDeleted(id));
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const sendverifyemail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const verifyEmailPin = generateSixDigitNumber();
    SendEmailMessage(
      email,
      "Email verification",
      `Email verification pin is ${verifyEmailPin}`
    )
      .then((info) => {
        if (info.accepted.length > 0) {
          // console.log({
          //   txt: "Email sent successfully",
          //   info: info.messageId,
          // });
          res.status(200).json(EmailPinSent);
        }
      })
      .catch((error: any) => {
        console.error("Error sending email:", error);
        res.status(200).json(InvalidEmail);
      });
  } catch (error) {
    console.log(error);
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const sendverifyphone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const query = "phonenumber";
    var isUserExist = await FirstOrDefault(schTab, query, phone);
    if (isUserExist == null) {
      res.status(404).json(Message(404, userNotFound));
    } else {
      const vPin = generateSixDigitNumber();
      SendPhoneMessage(`+${phone}`, `Phone verification pin is ${vPin}`);
      const success = Message(200, PhonePinSent, null);
      res.status(200).json(success);
    }
  } catch (error) {
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const newtoken = async (req: Request, res: Response) => {
  const { RefreshToken } = req.body;
  const rtokenInDb = await FirstOrDefault(rtokTab, rtokTab, RefreshToken);

  if (RefreshToken == null) return res.status(401).json("Unauthorized");

  if (rtokenInDb === null) return res.status(403).json("Forbidden!!!");

  verify(RefreshToken, jwtrefreshsecret, (err: any, user: any) => {
    if (err) return res.status(403).json("Forbidden");

    const accesstoken = generateAccessToken({
      Email: user.email,
      Id: user.id,
    });
    return res.status(200).json({ accesstoken: accesstoken });
  });
};

export const logout = async (req: Request, res: Response) => {
  // Assuming you have access to the user's refresh token
  const { RefreshToken } = req.body;

  // Delete the refresh token from the server-side storage
  await Remove(rtokTab, rtokTab, RefreshToken);

  // Send a response indicating successful logout
  return res.status(200).json("Logged out successfully");
};
