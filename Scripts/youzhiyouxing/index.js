const puppeteer = require('puppeteer-core');
const path = require('path');

// 有知有行
const urls = [
];

const titles = [
];

/**
 * wait [time] seconds
 * @param {*} time sleep time, eg: 1, 2
 */
async function sleep(seconds) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

async function getOnePage(page, url, title) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await sleep(20);
  const removeElementSelector = '.app\\:tw-hidden';
  await page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    for (let i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, removeElementSelector);

  // 滚动加载资源
  await page.evaluate(() => new Promise((resolve) => {
    const slide = document.documentElement;
    console.log(slide);
    let x = 0;

    function move() {
      setTimeout(() => {
        slide.scrollTop = x;
        console.log(x);
        x += 100;
        if (x < 10000) {
          move();
        } else {
          resolve();
        }
      }, 100);
    }
    move();
  }));

  await page.pdf({ // 纸张尺寸
    format: 'A4',
    // 打印背景,默认为false
    printBackground: true,
    // 不展示页眉
    displayHeaderFooter: false,
    // 页眉与页脚样式,可在此处展示页码等
    margin: {
      top: '2px',
      bottom: '35px',
    },
    path: path.resolve(__dirname, `./docs/${title}.pdf`),
  });
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: path.resolve(__dirname, '../../local_node_module/Chromium.app/Contents/MacOS/Chromium'),
    args: [
      '--window-size=1742,1000',
    ],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1742,
    height: 1000,
  });
  for (let i = 0; i < urls.length; i++) {
    await getOnePage(page, urls[i], titles[i]);
  }
}

(async () => {
  await main();
})();
