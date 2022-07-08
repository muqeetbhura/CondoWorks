const puppeteer = require("puppeteer");
const path = require("path");

const downloadPath = path.resolve("./");

(async () => {
  try {
    // auth values
    const username = "coop.test@condoworks.co";
    const password = "MyTesting711";

    // puppeteer config
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 25,
    });
    const page = await browser.newPage({
      defaultViewport: { width: 1100, height: 900 },
    });
    page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1100, height: 900 });
    await page.goto("https://app-dev.condoworks.co");

    // log into platform
    await page.focus("#Email");
    await page.keyboard.type(username);
    await page.focus("#Password");
    await page.keyboard.type(password);
    await page.click("#btnSubmit");
    console.log("Logged In!");

    // navigate to invoices and search for file
    await page.click("a[class='nav-link dropdown-toggle']");
    await page.click("a[href='/invoices/all']");
    console.log("Files Loading...");
    await page.waitForTimeout(1000);
    await page.focus("input[name='invoices.InvoiceNumber']");
    await page.keyboard.type("123");
    await page.waitForTimeout(400);

    // go to file page
    let file = await page.$("td[title='123444']");
    for (let i = 1; i <= 7; i++) {
      file = await page.evaluateHandle(
        (el) => el.previousElementSibling,
        file
      );
    }
    const fileLink = await page.evaluateHandle((e) => e.children[0], file);
    const fileLinkURL = await (await fileLink.getProperty("href")).jsonValue();
    await page.goto(fileLinkURL);
    console.log("File Located! Preparing Download...");

    // download file
    client = await page.target().createCDPSession()
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
      });
    await page.click("a[title='Download file']");
    await page.waitForTimeout(3000);
    console.log("File Successfully Downloaded!");
    console.log(
      `The file was saved to your current directory, its path is: ${__dirname}`
    );

    await browser.close();
  } catch (err) {
    console.log(err);
  }
})();