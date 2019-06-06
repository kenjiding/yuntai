module.exports = {
  plugins: {
    // vant定制主题
    "postcss-easy-import": {
      extensions: ["pcss", "css"]
    },
    "postcss-theme-variables": {
      vars: {
        "black": "#000",
        "white": "#fff",
        "red": "#E54B5E",
        "gray": "#909399",
        "blue": "#077AFF",
        "orange": "#E6A23C",
        "green": "#67C23A",
        "text-color": "#333333",
        "button-primary-background-color": "#077AFF",
        "button-primary-border-color": "#077AFF",
        "button-bottom-action-default-background-color": "#077AFF"
      },
      prefix: '$'
    },
    "precss": {},
    "postcss-calc": {},

    // vw移动适配方案
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 375, // (Number) The width of the viewport. 
      viewportHeight: 1334, // (Number) The height of the viewport. 
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to. 
      viewportUnit: 'vw', // (String) Expected units. 
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px. 
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace. 
      mediaQuery: false // (Boolean) Allow px to be converted in media queries. 
    },
    "postcss-viewport-units": {
      filterRule: function (rule) {
        var selector = rule.selector;
        var regexps = [
          /^.van.+:before$/i,
          /^.van.+:after$/i
        ];

        var isMatch = regexps.find(function (patt) {
          return patt.test(selector);
        });

        if (isMatch) return false;

        return true;
      }
    },
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    },
  }
}