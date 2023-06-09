import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import * as fs from 'fs';

const PATHS = {
  win32: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: 'C:\\Users\\root\\AppData\\Local\\Temp\\puppeteer_user_data',
  },
  linux: {
    executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
    userDataDir: '/mnt/c/Users/root/AppData/Local/Temp/puppeteer_user_data',
  },
}

const getTopHolderList = async () => {
  const browser = await puppeteer.launch({
    executablePath: PATHS[process.platform].executablePath,
    headless: false,
    defaultViewport: null,
  });

  let pageIndex = 1;
  let page = await browser.newPage();
  while (pageIndex <= 4) {
    try {
      await page.goto(`https://ethplorer.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#chart=candlestick&pageTab=holders&tab=tab-holders&pageSize=100&holders=${pageIndex}`, {
        waitUntil: 'networkidle0'
      });
      await page.reload();
      const content = await page.content();
      const $ = await cheerio.load(content);
      const addressTds = $('.toggle-inline-controls');
      for (let i = 0; i < addressTds.length; i++) {
        const items = $(addressTds[i]).children();
        const address = (items[0].children[0].data || '').toLowerCase() + '\n';
        console.log('address: ', address);
        if (address.indexOf('0x') >= 0) {
          await fs.writeFileSync('./address.txt', address, {flag: 'a+'});
        }
      }
      pageIndex++;
    } catch (e) {
      console.log(e);
    }
  }
  process.exit();
};

getTopHolderList().then();

