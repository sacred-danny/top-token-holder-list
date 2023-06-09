import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from "puppeteer";

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

  let pageIndex = 1;
  const page = await browser.newPage();
  const addresses = [];

  while (true) {
    try {
      await page.goto(`https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick&pageTab=holders&tab=tab-holders&pageSize=100&holders=${pageIndex}`, {
        waitUntil: 'networkidle0'
      });
      const content = await page.content();
      const $ = await cheerio.load(content);
      const addressTds = $('.toggle-inline-controls');
      for (let i = 0; i < addressTds.length; i++) {
        const items = $(addressTds[i]).children();
        const address = (items[0].children[0].data || '').toLowerCase();
        addresses.push(address);
      }
      console.log('address: ', addresses.length);
      pageIndex++;
    } catch (e) {
      console.log(e);
    }
  }

  // const td = addressTds[0];
  // const items = $(td).children();
  // console.log('items length: ', items.length);
  // console.log('first item: ', items[0].children[0].data);
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

