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

const {
  GCID_COOKIE_VALUE,
  GCESS_COOKIE_VALUE,
} = Constans;

// 获取所有文章 id 的接口， POST 请求
// https://time.geekbang.org/serv/v1/column/articles

/**
 * 用于文字课程
 * 用于《算法与数据结构之美》课程 https://time.geekbang.org/column/article/39922
 */
async function func1() {
  const idArr = [113399,
    113513,
    113550,
    116588,
    117637,
    118205,
    118826,
    119046,
    120257,
    126339,
    127495,
    128427,
    129596,
    131233,
    131887,
    132931,
    134456,
    135127,
    135624,
    136895,
    137827,
    138844,
    140140,
    140703,
    141842,
    143889,
    144569,
    144983,
    145546,
    147501,
    148546,
    150159,
    151370,
    152807,
    154110,
    155183,
    156181,
    157406,
    211563,
    165897,
    169468,
    174254,
    177070,
    179428,
    180213];

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: path.resolve(__dirname, '../../local_node_module/Chromium.app/Contents/MacOS/Chromium'),
  });
  const page = await browser.newPage();
  await page.setCookie({
    name: 'GCESS',
    value: GCESS_COOKIE_VALUE,
    domain: '.geekbang.org',
    path: '/',
    httpOnly: true,
  }, {
    name: 'GCID',
    value: GCID_COOKIE_VALUE,
    domain: '.geekbang.org',
    path: '/',
    httpOnly: true,
  });
  await page.setViewport({
    width: 1200,
    height: 2000,
  });

  async function readArticle(id) {
    console.log(`article ${id} 开始`);

    await page.goto(`https://time.geekbang.org/column/article/${id}`, {
      waitUntil: 'networkidle2',
    });

    await page.waitFor('.simplebar-content-wrapper');
    await page.evaluate(() => new Promise((resolve) => {
      const slide = document.querySelectorAll('.simplebar-content-wrapper')[1];
      console.log(slide);
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
 * 用于视频课程
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
    await open(url, {
      app: ['google chrome', '--incognito'],
    });
    await sleep(10);
  }
  console.log('finish');
}


(async () => {
  await func1();
  // await func2();
})();
