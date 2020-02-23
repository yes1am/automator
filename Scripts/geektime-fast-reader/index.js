const puppeteer = require('puppeteer-core');
const path = require('path');
const Constans = require('./site.token');

const { GCID_COOKIE_VALUE, GCESS_COOKIE_VALUE } = Constans;

// 获取所有文章 id 的接口， POST 请求
// https://time.geekbang.org/serv/v1/column/articles

const idArr = [
  76207,
  76468,
  76827,
  77142,
  77457,
  77830,
  78175,
  78449,
  78795,
  79159,
  79433,
  79871,
  80388,
  80850,
  40681,
  69607,
  73786,
  75197,
  81997,
  91541,
  80456,
  80457,
  80458,
  81008,
  81186,
  81218,
  80459,
  81230,
  81263,
  81835,
  161115,
  168882,
  178378,
  181421,
  185686,
  188898,
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: path.resolve(__dirname, '../../local_node_module/Chromium.app/Contents/MacOS/Chromium'),
  });
  const page = await browser.newPage();
  await page.setCookie(
    {
      name: 'GCESS',
      value: GCESS_COOKIE_VALUE,
      domain: '.geekbang.org',
      path: '/',
      httpOnly: true,
    },
    {
      name: 'GCID',
      value: GCID_COOKIE_VALUE,
      domain: '.geekbang.org',
      path: '/',
      httpOnly: true,
    },
  );
  await page.setViewport({
    width: 1200,
    height: 2000,
  });

  async function readArticle(id) {
    console.log(`article ${id} 开始`);

    await page.goto(`https://time.geekbang.org/column/article/${id}`, {
      waitUntil: 'networkidle2',
    });

    await page.waitFor('.ibY_sXau_0');
    await page.evaluate(() => new Promise((resolve) => {
      const slide = document.querySelector('.ibY_sXau_0');
      let x = 0;
      function move() {
        setTimeout(() => {
          slide.scrollTop = x;
          console.log(x);
          x += 20;
          if (x < 10000) {
            move();
          } else {
            resolve();
          }
        }, 100);
      }
      move();
    }));
  }

  // test
  // readArticle(idArr[0])

  for (let i = 0; i < idArr.length; i++) {
    await readArticle(idArr[i]);
  }
  console.log('finish');
})();
