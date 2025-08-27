import axios from "axios"

export const apiConnector = async (method: string, url: string, body = {}, headers = {}) => {
  try {
    
    console.log(">>> FETCHING", method, url);
    //console.log(updatedHeaders);  
    console.log("→ Headers Received:", headers);
    console.log("Body:",body);
    
    //then sending API request to backend with axios
    const response = await axios({
      method,
      url,
      data: body,
      //headers:updatedHeaders,
      headers,
      withCredentials: true,
    })
    

    console.log("API Response:", response);

    return response
  } catch (error: any) {
    throw error?.response?.data || { message: "API Error" }
  }
}

