import ZoomScraper from "zscraper";
import Puppeteer from "puppeteer";

(async() => {

    // Setup Puppeteer options
    const puppeteerOptions = {
        headless: false,
        defaultViewport: null,
    };

    // Creates puppeteer/chromium instance
    const browser = await Puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();

    // Instantiate scraper with your organisations' name
    const zoom = new ZoomScraper("navitas");

    // Login to given organisation with user name and password
    await zoom.login(page, process.env.ZOOM_ID, process.env.ZOOM_PASSWORD);

    // Get meetings as custom data object between _from and _to dates.
    const meetings = await zoom.getMeetings(page, "04/01/2022", "04/03/2022");

    // Get meetings as custom data object between _from and _to dates.
    console.log(meetings[0]);
})();