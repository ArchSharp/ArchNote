import { CACCompany } from "./../Domain/CACCompany";
import {
  MakeGetRequest,
  MakePostRequest,
} from "./../Services/Implementations/HttpClientService";
import { Request, Response } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache();

// Make a GET request
export const UniversitiesByCountry = async (req: Request, res: Response) => {
  const { country } = req.params;

  try {
    const isCached = CheckCacheResource(country, res);
    if (!isCached) {
      const response = await MakeGetRequest(
        `http://universities.hipolabs.com/search?country=${country}`
      );
      cache.set(country, response, 300);
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Make a POST request with data
export const VerifyCompany = async (req: Request, res: Response) => {
  const url =
    "https://postapp.cac.gov.ng/postapp/api/front-office/search/company-business-name-it";
  const { param } = req.params;
  const payload = { searchTerm: param };
  try {
    var response = await MakePostRequest(url, payload);
    const companyPayload: CACCompany[] | null = response.data;
    response = companyPayload.length > 1 ? null : companyPayload[0];
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
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

const CheckCacheResource = (cacheKey: string, res: Response): boolean => {
  // Check if the data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`cached data for key: ${cacheKey} is available`);
    res.status(200).json(cachedData);
    return true;
  }
  return false;
};
