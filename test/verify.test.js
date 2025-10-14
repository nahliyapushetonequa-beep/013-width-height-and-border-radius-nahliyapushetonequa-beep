const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    fs.readFile(__dirname + "/.." + req.url, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });
  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  } catch (error) {
    console.error("Failed to launch Puppeteer browser:", error);
    throw error;
  }
});

afterEach(async () => {
  try {
    await browser.close();
  } catch (error) {
    console.error("Failed to close Puppeteer browser:", error);
  }
});

describe('the image with sized-pic id', () => {
  it('should be 50px wide', async () => {
    const width = await page.$eval('img[id="sized-pic"]', (img) => {
      let style = window.getComputedStyle(img);
      return style.getPropertyValue('width');
    });
    expect(width).toEqual('50px');
  });

  it('should be 60px tall', async () => {
    const height = await page.$eval('img[id="sized-pic"]', (img) => {
      let style = window.getComputedStyle(img);
      return style.getPropertyValue('height');
    });
    expect(height).toEqual('60px');
  });
});

describe('the image with rounded-pic id', () => {
  it('should have rounded corners', async () => {
    const borderRadius = await page.$eval('img[id="rounded-pic"]', (img) => {
      let style = window.getComputedStyle(img);
      return style.getPropertyValue('border-radius');
    });
    expect(borderRadius).toEqual('15px');
  });
});

describe('the image with circle-pic id', () => {
  it('should be displayed as a complete circle', async () => {
    const borderRadius = await page.$eval('img[id="circle-pic"]', (img) => {
      let style = window.getComputedStyle(img);
      return style.getPropertyValue('border-radius');
    });
    expect(borderRadius).toEqual('50%');
  });
});

