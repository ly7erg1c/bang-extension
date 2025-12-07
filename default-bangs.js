// Default bang shortcuts
const DEFAULT_BANGS = [
  {
    trigger: "g",
    url: "https://www.google.com/search?q={{{s}}}",
    description: "Google Search"
  },
  {
    trigger: "gi",
    url: "https://www.google.com/search?tbm=isch&q={{{s}}}",
    description: "Google Images"
  },
  {
    trigger: "gm",
    url: "https://www.google.com/maps/search/{{{s}}}",
    description: "Google Maps"
  },
  {
    trigger: "yt",
    url: "https://www.youtube.com/results?search_query={{{s}}}",
    description: "YouTube"
  },
  {
    trigger: "w",
    url: "https://en.wikipedia.org/wiki/{{{s}}}",
    description: "Wikipedia"
  },
  {
    trigger: "a",
    url: "https://www.amazon.com/s?k={{{s}}}",
    description: "Amazon"
  },
  {
    trigger: "gh",
    url: "https://github.com/search?q={{{s}}}",
    description: "GitHub"
  },
  {
    trigger: "so",
    url: "https://stackoverflow.com/search?q={{{s}}}",
    description: "Stack Overflow"
  },
  {
    trigger: "r",
    url: "https://www.reddit.com/search?q={{{s}}}",
    description: "Reddit"
  },
  {
    trigger: "tw",
    url: "https://twitter.com/search?q={{{s}}}",
    description: "Twitter/X"
  },
  {
    trigger: "imdb",
    url: "https://www.imdb.com/find?q={{{s}}}",
    description: "IMDb"
  },
  {
    trigger: "wa",
    url: "https://www.wolframalpha.com/input/?i={{{s}}}",
    description: "Wolfram Alpha"
  },
  {
    trigger: "dd",
    url: "https://duckduckgo.com/?q={{{s}}}",
    description: "DuckDuckGo"
  },
  {
    trigger: "bing",
    url: "https://www.bing.com/search?q={{{s}}}",
    description: "Bing"
  },
  {
    trigger: "mdn",
    url: "https://developer.mozilla.org/en-US/search?q={{{s}}}",
    description: "MDN Web Docs"
  },
  {
    trigger: "npm",
    url: "https://www.npmjs.com/search?q={{{s}}}",
    description: "npm"
  },
  {
    trigger: "py",
    url: "https://docs.python.org/3/search.html?q={{{s}}}",
    description: "Python Docs"
  },
  {
    trigger: "translate",
    url: "https://translate.google.com/?text={{{s}}}",
    description: "Google Translate"
  },
  {
    trigger: "maps",
    url: "https://www.google.com/maps/search/{{{s}}}",
    description: "Google Maps"
  },
  {
    trigger: "ebay",
    url: "https://www.ebay.com/sch/i.html?_nkw={{{s}}}",
    description: "eBay"
  },
  {
    trigger: "news",
    url: "https://news.google.com/search?q={{{s}}}",
    description: "Google News"
  },
  {
    trigger: "scholar",
    url: "https://scholar.google.com/scholar?q={{{s}}}",
    description: "Google Scholar"
  },
  {
    trigger: "linkedin",
    url: "https://www.linkedin.com/search/results/all/?keywords={{{s}}}",
    description: "LinkedIn"
  },
  {
    trigger: "wayback",
    url: "https://web.archive.org/web/*/{{{s}}}",
    description: "Wayback Machine"
  },
  {
    trigger: "giphy",
    url: "https://giphy.com/search/{{{s}}}",
    description: "Giphy"
  }
];
