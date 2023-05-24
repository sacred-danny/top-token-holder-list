import * as cheerio from 'cheerio';
import axios from 'axios';

const axiosResponse = await axios.request({
  method: "GET",
  url: "https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick/",
});

if (axiosResponse && axiosResponse.data) {
  const $ = await cheerio.load(axiosResponse.data);
  const addressTds = $('.toggle-inline-controls');
  const evens = $('.even');
  console.log('addressTds length: ', addressTds.length);
  console.log('evens length: ', evens.length);
  for await (const td of addressTds) {
    const item = $(td);
    const children = item.children();
    if (children.length > 0) {
      const address = $(children[0]).innerText;
      const innerText = $(children[children.length - 1]).innerText;
      console.log(`address: ${address}, innerText: ${innerText}`);
    }
  }
}

