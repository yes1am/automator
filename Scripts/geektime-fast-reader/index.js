const puppeteer = require('puppeteer-core');
const path = require('path');
const open = require('open');
const Constans = require('./site.token');

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

const { GCID_COOKIE_VALUE, GCESS_COOKIE_VALUE } = Constans;

// 获取所有文章 id 的接口， POST 请求
// https://time.geekbang.org/serv/v1/column/articles

/**
 * 用于《算法与数据结构之美》课程 https://time.geekbang.org/column/article/39922
 */
async function func1() {
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
}

/**
 * 用于《TypeScript开发实战》, https://time.geekbang.org/course/intro/211
 */
async function func2() {
  // 打开 tab 的梳理
  // FIXME: 测试发现，打开 10 个页面，播放时会卡顿，可能是竞争网速的原因
  const pageCount = 10;
  const videosId = [
    108620,
    108528,
    108543,
    108544,
    108545,
    108549,
    108568,
    108550,
    108552,
    108553,
    110279,
    110281,
    110282,
    110283,
    110284,
    110399,
    110289,
    111933,
    111928,
    111929,
    111931,
    112039,
    112028,
    112029,
    116216,
    116217,
    117235,
    117236,
    117237,
    117238,
    117239,
    118533,
    118534,
    118535,
    118536,
    118537,
    118538,
    123392,
    123391,
    123393,
    123397,
    123394,
    123395,
    128376,
    128377,
    128378,
    128385,
  ];
  const eachPageShouldPlayVideosCount = Math.ceil(videosId.length / pageCount);
  const eachPageFirstIds = videosId.filter(
    (_, index) => index % eachPageShouldPlayVideosCount === 0,
  );

  for (let i = 0; i < eachPageFirstIds.length; i++) {
    const id = eachPageFirstIds[i];
    // FIXME: 由于 chromium 打开页面不能进行自动播放，不确定是 chromium 问题还是其他原因
    // 暂时使用本地浏览器打开页面
    const url = `https://time.geekbang.org/course/detail/211-${id}`;
    await open(url, { app: ['google chrome', '--incognito'] });
    await sleep(10);
  }
  console.log('finish');
}


(async () => {
  // await func1();
  await func2();
})();
