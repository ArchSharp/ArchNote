import { CACCompany } from "./../Domain/CACCompany";
import {
  MakeGetRequest,
  MakePostRequest,
} from "./../Services/Implementations/HttpClientService";
import { Request, Response } from "express";

// Make a GET request
export const UniversitiesByCountry = (req: Request, res: Response) => {
  const { country } = req.params;
  //   console.log(country);
  MakeGetRequest(`http://universities.hipolabs.com/search?country=${country}`)
    .then((response) => {
      //   console.log(response);
      return res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Make a POST request with data
export const VerifyCompany = (req: Request, res: Response) => {
  const url =
    "https://postapp.cac.gov.ng/postapp/api/front-office/search/company-business-name-it";
  const { param } = req.params;
  const payload = { searchTerm: param };
  MakePostRequest(url, payload)
    .then((response) => {
      // console.log(response);
      return res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const InternalVerifyCompany = async (
  param: string
): Promise<CACCompany[] | null> => {
  const url =
    "https://postapp.cac.gov.ng/postapp/api/front-office/search/company-business-name-it";
  const payload = { searchTerm: param };

  try {
    const response = await MakePostRequest(url, payload);
    const verifyResponse: CACCompany[] = response.data;
    if (verifyResponse.length > 1) return null;
    else return verifyResponse;
  } catch (error) {
    return null;
  }
};
