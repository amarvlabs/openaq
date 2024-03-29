import axios from 'axios';

export const getData = async (url) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return console.error(error);
  }
};
