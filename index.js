import cheerio from 'cheerio';
import axios from 'axios';

const axiosResponse = await axios.request({
  method: "GET",
  url: "https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick&pageTab=holders&tab=tab-holders&pageSize=100&holders=1",
});

console.log('axiosResponse: ', axiosResponse);
