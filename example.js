import Zoom from "./index.js";
import Puppeteer from "puppeteer";

(async() => {

    //Initiate scraper
    const zoom = new Zoom();

    const browser = await Puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // Login
    await zoom.login(page, process.env.ZOOM_ID, process.env.ZOOM_PASSWORD)

    // Get meetings
    const meetings = await zoom.getMeetings(page, "123213", "21123")

    console.log(meetings[0]);

    // Close browser/page and return
    await page.close()
    await browser.close();
})();