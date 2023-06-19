import {
  CreateSuccess,
  FetchedSuccess,
  InternalError,
  LoginSuccess,
  SchoolNotFound,
  StaffAlreadyExist,
  StaffDeleted,
  StaffNotFound,
  UpdateSuccess,
  WrongPassword,
  userNotFound,
} from "../Response/Responses";
import {
  AddToDB,
  FirstOrDefault,
  GetAllById,
  Remove,
  Update,
} from "../Infrastructure/Repository";
import { Request, Response } from "express";
import { Message } from "../Response/IResponse";
import {
  generateSixDigitNumber,
  generateStaffPassword,
} from "../Utilities/RandomNumber";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Services/Implementations/JwtService";
import bcrypt from "bcrypt";
import { IStaff } from "Domain/Staff";

const schTab = "SchoolOwner";
const staffTable = "Staff";
const schoolidDb = "Id";
const staffIdDb = "Id";
const staffemail = "Email";
const rtokTab = "RefreshToken";

export const addstaff = async (req: Request, res: Response): Promise<any> => {
  try {
    const newStaff: IStaff = req.body;
    const id = newStaff.SchoolId;

    var isSchoolExist = await FirstOrDefault(schTab, schoolidDb, id);
    if (isSchoolExist == null) {
      const error = Message(400, SchoolNotFound);
      return res.status(400).json(error);
    }
    var isStaffExist = await FirstOrDefault(
      staffTable,
      "Email",
      newStaff.Email
    );
    if (isStaffExist != null) {
      const error = Message(400, StaffAlreadyExist);
      return res.status(400).json(error);
    }

    //create staff password and hash with bcrypt
    const staffPassword = generateStaffPassword(10);
    const hash = await bcrypt.hash(staffPassword, 10);
    newStaff.Password = hash;
    // console.log("staff password ", staffPassword);
    //create staff email
    const threeLetters = newStaff.LastName.substring(0, 3);
    let sixDigit = generateSixDigitNumber();
    let staffEmail = threeLetters
      .concat(sixDigit.toString())
      .concat("@ANote.com");

    let i = 0;
    while (i !== -1) {
      const isStaffEmailExist = await FirstOrDefault(
        staffTable,
        "Email",
        staffEmail
      );
      if (isStaffEmailExist === null) {
        console.log("New staff email:", staffEmail);
        i = -1;
      } else {
        console.log(staffEmail, "is taken");
        console.log("Generating new staff email...");
        sixDigit = generateSixDigitNumber();
        staffEmail = threeLetters
          .concat(sixDigit.toString())
          .concat("@ANote.com");
      }
    }
    newStaff.SchoolEmail = staffEmail;
    const response = await AddToDB(staffTable, newStaff);
    const success = Message(200, CreateSuccess, response);
    res.status(200).json(success);
  } catch (error) {
    const err = Message(500, InternalError);
    res.status(500).json(err);
  }
};

export const deletestaff = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const isStaffExist = await FirstOrDefault(staffTable, staffemail, email);

    if (isStaffExist == null) {
      const error = Message(400, StaffNotFound);
      res.status(400).json(error);
    } else {
      await Remove(staffTable, staffemail, email);
      res.status(200).json(StaffDeleted(email));
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const getstaff = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const isStaffExist = await FirstOrDefault(staffTable, staffemail, email);

    if (isStaffExist == null) {
      const error = Message(400, StaffNotFound);
      res.status(400).json(error);
    } else {
      const response = Message(200, FetchedSuccess, isStaffExist);
      res.status(200).json(response);
    }
  } catch (error) {
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const getallstaffs = async (req: Request, res: Response) => {
  try {
    const { schoolid } = req.params;
    const staffs = await GetAllById(staffTable, schoolidDb, schoolid);
    const txt =
      staffs != null ? `${staffs.length} ${FetchedSuccess}` : "No records";
    const sucResponse = Message(200, txt, staffs);
    res.status(200).json(sucResponse);
  } catch (error) {
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { Email, Password } = req.body;
    const email = "schoolemail";
    var isUserExist = await FirstOrDefault(staffTable, email, Email);
    if (isUserExist == null) {
      res.status(404).json(Message(404, userNotFound));
    } else {
      const isMatched = await bcrypt.compare(Password, isUserExist.password);
      if (!isMatched) {
        const error = Message(400, WrongPassword);
        res.status(400).json(error);
      } else {
        //await producer.publishMessage("testing");
        const refreshtoken = generateRefreshToken(isUserExist);
        const accesstoken = generateAccessToken(isUserExist);
        //save refresh token
        const newRToken = { refreshtoken: refreshtoken };
        await AddToDB(rtokTab, newRToken);
        //------------------
        const tokens = {
          accesstoken: accesstoken,
          refreshtoken: refreshtoken,
        };
        const success = Message(200, LoginSuccess, isUserExist, tokens);
        res.status(200).json(success);
      }
    }
  } catch (error) {
    console.log(error);
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const editedStaff = req.body;
    const isStaffExist = await FirstOrDefault(staffTable, "id", id);
    if (isStaffExist == null) {
      const error = Message(400, StaffNotFound);
      res.status(400).json(error);
    } else {
      const update = await Update(staffTable, "id", id, editedStaff);
      const response = Message(200, UpdateSuccess, update);
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  // Assuming you have access to the user's refresh token
  const { refreshToken } = req.body;

  // Delete the refresh token from the server-side storage
  await Remove(rtokTab, rtokTab, refreshToken);

  // Send a response indicating successful logout
  return res.status(200).json("Logged out successfully");
};
