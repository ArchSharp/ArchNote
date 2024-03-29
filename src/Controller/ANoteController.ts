import { Request, Response } from "express";
import {
  alterTableQuery,
  refreshTokenTable,
  schoolTable,
  staffTable,
} from "../Database/DbUtilities";
import {
  AlterTable,
  CreateDatabase,
  CreateTable,
  FirstOrDefault,
  GetAll,
} from "../Infrastructure/Repository";
import {
  FetchedSuccess,
  InternalError,
  SchoolNotFound,
} from "../Response/Responses";
import { Message } from "../Response/IResponse";

const schTab = "SchoolOwner";
const dbId = "CacRegNumber";

export const createDB = async (req: Request, res: Response) => {
  try {
    const Db = CreateDatabase("archnote");
    res.status(200).json(Db);
  } catch (error) {
    res.status(400).json("Failed database creation");
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const DbTab = CreateTable(refreshTokenTable);
    res.status(200).json(DbTab);
  } catch (error) {
    res.status(400).json("Failed table creation");
  }
};

export const alterTable = async (req: Request, res: Response) => {
  try {
    const DbTab = AlterTable(alterTableQuery);
    res.status(200).json(DbTab);
  } catch (error) {
    res.status(400).json("Failed table alteration");
  }
};

export const getSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isSchoolExist = await FirstOrDefault(schTab, dbId, id);

    if (isSchoolExist == null) {
      const error = Message(400, SchoolNotFound);
      res.status(400).json(error);
    } else {
      const response = Message(200, FetchedSuccess, isSchoolExist);
      res.status(200).json(response);
    }
  } catch (error) {
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};

//get all schools
export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const schools = await GetAll(schTab);
    const txt =
      schools != null ? `${schools.length} ${FetchedSuccess}` : "No records";
    const sucResponse = Message(200, txt, schools);
    res.status(200).json(sucResponse);
  } catch (error) {
    const errMessage = Message(500, InternalError);
    res.status(500).json(errMessage);
  }
};
