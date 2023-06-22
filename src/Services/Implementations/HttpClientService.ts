import axios from "axios";

export const MakeGetRequest = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const MakePostRequest = async (
  url: string,
  payload: any
): Promise<any> => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
