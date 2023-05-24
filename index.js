import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from "puppeteer";

// const axiosResponse = await axios.request({
//   method: "GET",
//   url: "https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick&pageTab=holders&tab=tab-holders&pageSize=100&holders=1",
//   headers: {
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
//   }
// });
//
// if (axiosResponse && axiosResponse.data) {
//   const $ = await cheerio.load(axiosResponse.data);
//   console.log('data:', axiosResponse.data);
//   const addressTds = $('.toggle-inline-controls');
//   const evens = $('.even');
//   console.log('addressTds length: ', addressTds.length);
//   console.log('evens length: ', evens.length);
//   for await (const td of addressTds) {
//     const item = $(td);
//     const children = item.children();
//     if (children.length > 0) {
//       const address = $(children[0]).innerText;
//       const innerText = $(children[children.length - 1]).innerText;
//       console.log(`address: ${address}, innerText: ${innerText}`);
//     }
//   }
// }

const PATHS = {
  win32: {
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: 'C:\\Users\\root\\AppData\\Local\\Temp\\puppeteer_user_data',
  },
  linux: {
    executablePath: "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
    userDataDir: '/mnt/c/Users/root/AppData/Local/Temp/puppeteer_user_data',
  },
}

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    executablePath: PATHS[process.platform].executablePath,
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick&pageTab=holders&tab=tab-holders&pageSize=100&holders=1", {
    waitUntil: 'networkidle0'
  });

  const content = await page.content();
  const $ = await cheerio.load(content);
  const addressTds = $('.toggle-inline-controls');
  const td = addressTds[0];
  const items = $(td).children();
  console.log('items length: ', items.length);
  console.log('first item: ', items[0].innerText);
  // for await (const td of addressTds) {
  //   const children = td.children;
  //   console.log('first children: ', children[0]);
  //   if (children.length > 0) {
  //     const address = $(children[0]).innerText;
  //     const innerText = $(children[children.length - 1]).innerText;
  //     console.log(`address: ${address}, innerText: ${innerText}`);
  //   }
  // }
};

// Start the scraping
getQuotes();

