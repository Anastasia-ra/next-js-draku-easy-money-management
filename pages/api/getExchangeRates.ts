import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getExchangeRates(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const URL = `https://v6.exchangerate-api.com/v6/${process.env.SECRET_KEY}/latest/EUR`;
  const responseExhangeRates = await axios.get(URL);
  response.status(200).json({ data: responseExhangeRates.data });
}
