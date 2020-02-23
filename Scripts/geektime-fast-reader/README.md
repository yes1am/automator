## 极客时间“快速阅读器”

由于某些原因，需要让已购买的“极客时间”课程，快速标记为已完成，故有了该脚本

## 使用

在当前目录新建 `site.config.js`,内容为:  

```js
const GCID_COOKIE_VALUE = 'cookie GCID 的值';
const GCESS_COOKIE_VALUE = 'cookie GCESS 的值';

module.exports = {
  GCID_COOKIE_VALUE,
  GCESS_COOKIE_VALUE,
};
```

其中这些 cookie 的值代表了你的登录态，**千万不要提交到 github**