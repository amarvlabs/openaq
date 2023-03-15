import axios from 'axios';

export const getData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    return console.error(error);
  }
};

export const getParameters = async () => {
  try {
    const response = await axios.get(
      'https://api.openaq.org/v2/parameters?limit=100&page=1&offset=0&sort=asc&order_by=id'
    );
    return response.data.results;
  } catch (error) {
    return console.error(error);
  }
}
