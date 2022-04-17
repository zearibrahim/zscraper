import * as Puppeteer from 'puppeteer';
import * as messages from "./messages.js"
/**
 * Zoom class and functions for https://www.navitas.zoom.us.
 * @author Zear Ibrahim
 */

export default class Zoom {
    /**
     * Instantiate the Zoom object and org name.
     * @param {String} org 
     */
    constructor(org) {
        this.loginUrl = "https://" + org + ".zoom.us/signin ";
        this.reportsUrl = "https://" + org + ".zoom.us/account/my/report";
        console.log(`[${Zoom.name}] Has been started`);
    }

    /**
     * Login to Zoom using the provided credentials.
     * * NOTE: This login method requires a pre-configured authenticator such as mobile phone to approve the login attempt.
     * @param {Puppeteer.Page} page a blank puppeteer page.
     * @param {String} username a string username for {@link loginUrl} using {@type {Env}} entries.
     * @param {String} password a string password for {@link loginUrl} using {@type {Env}} entries.
     * @throws {@link messages.TIMEOUT} times out upon authentication failure.
     */
    async login(page, username, password) {
        console.log(`[${Zoom.name}] Opening [${this.loginUrl}]`);
        await page.goto(this.loginUrl);

        //Email - Microsoft uses input field with data-bind and id instead of name
        await page.waitForSelector("#i0116");
        await page.focus("#i0116");
        await page.type("#i0116", username);

        //Next
        await page.waitForSelector("#idSIButton9");
        await page.click("#idSIButton9");

        await page.waitForNetworkIdle();

        //Password
        await page.waitForSelector("#i0118");
        await page.focus("#i0118");
        await page.type("#i0118", password);

        await page.waitForNetworkIdle();

        //Next
        await page.waitForSelector("#idSIButton9");
        await page.click("#idSIButton9");

        //Wait for authentication and check if Zoom page is loaded based on user content
        console.log(`[${Zoom.name}] Waiting for authentication...`);
        await page
            .waitForSelector("#headerPic", { visible: true })
            .then(() => console.log(`[${Zoom.name}] ${messages.SUCCESS_LOGIN} on [${this.loginUrl}]`))
            .catch(() => {
                console.log(`[${Zoom.name}] ${messages.TIMEOUT}`);
                process.exit(1);
            });
    }

    /**
     * Get meeting data from the Zoom reporting window.
     * @param {Puppeteer.Page} page a puppeteer page logged into Zoom.
     * @param {String} _from optional from date "mm/dd/yyyy".
     * @param {String} _to optional to date "mm/dd/yyyy".
     * @todo apply _from and _to date validation and ensure page is logged in.
     * @returns {Promise<import("./interfaces").IZoomMeetings>} data interface representing list of participants.
     */
    async getMeetings(page, _from, _to) {
        const url = this.reportsUrl + ((!_from || !_to) ? _getForIncompleteRegisters() : "?from=" + _from + "&to=" + _to);
        console.log(`[${Zoom.name}] Opening reporting page on [${url}]`);

        //await page.goto('file:/Users/Zear/Documents/vscode-workspace/bulmarking/scraper/test/reporting-page.html');
        await page.goto(url);


        //check if meetings are spread across multiple pages
        const meetingCountOnPage = await _getMeetingsCount(page);

        /**
         * @type {any[]}
         */
        const meetings = [];

        //If reports are spread over multiple pages then loop over each page. Otherwise grab current page only.
        if (meetingCountOnPage > 0) {
            while (meetingCountOnPage != meetings.length) {
                //Individually push each meeting to reports
                Array.from(await _getParticipantsForMeeting(page)).forEach(meeting => meetings.push(meeting));
                await page.click("#paginationDivMeeting > div > ul > li:nth-child(2) > a");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } else {
            Array.from(await _getParticipantsForMeeting(page)).forEach(meeting => meetings.push(meeting));
        }
        return meetings;
    }
}

/**
 * Get all participants for a given Zoom meeting modal table.
 * @param {Puppeteer.Page} page a puppeteer page the where meeting modal table is active and shown.
 * @returns {Promise<import("./interfaces").IZoomMeetings>} a data interface representing a list of meetings.
 */
async function _getParticipantsForMeeting(page) {
    //Enable logging from browser
    // const browserLabel = `[${Zoom.name} - in browser]`;
    // page.on('console', msg => {
    //     if (msg.text().includes(browserLabel)) {
    //         console.log(msg.text())
    //     }
    // });

    return await page.evaluate(async() => {
        const table = Array.from(document.querySelectorAll("#meeting_list tbody tr"))
        const meetings = [];

        for (const meeting of table) {
            const meetingData = Array.from(meeting.children).map(d => {
                if (d instanceof HTMLElement) return d.innerText;
            });
            const anchor = meeting.querySelector("td a");

            //Click on meeting anchor and wait for participants modal window popup
            if (anchor instanceof HTMLElement) anchor.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            //Get attendees
            const attendees = Array.from(document.querySelectorAll("#attendees-dialog-container #attendees_list_body tr"))
            const participants = [];

            //get participant data from attendee table row cells and push to list
            for (const attendee of attendees) {
                const cell = Array.from(attendee.children).map(d => d.textContent);

                //Exclude host and push to list
                if (cell[1].toLowerCase() == meetingData[3].toLowerCase()) continue;
                participants.push({ name: cell[0], email: cell[1], duration: cell[4], guest: cell[5] });
            }

            //push meeting and participant info to list. Note ID is not unique.
            meetings.push({
                id: meetingData[1],
                topic: meetingData[0],
                date: meetingData[8],
                timeFromTopic: meetingData[0].split(" ")[5],
                host: meetingData[3],
                // Filter unique participant names
                // https://stackoverflow.com/questions/32634736/javascript-object-array-removing-objects-with-duplicate-properties
                participants: participants.filter((obj, pos, arr) => arr.map(mapObj => mapObj["name"]).indexOf(obj["name"]) === pos)
            });

            //Print to console with custom label to detect when enabling logging
            //console.log(`${browserLabel} Saving meeting: [${meetingData[1]}]`);

            //close meeting dialog container
            const dialog = document.querySelector("#attendees-dialog-container button.close")
            if (dialog instanceof HTMLElement) dialog.click();
        }
        return meetings.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
    });
}

/**
 * Function to return the number of meetings on the page. 
 * @param {Puppeteer.Page} page a puppeteer page containing the Zoom meeting table to process.
 * @returns {Promise<number>} total meetings, 0 if meetings are all on a single page.
 */
async function _getMeetingsCount(page) {
    let count = 0;
    try {
        count = parseInt(await page.$eval("#paginationDivMeeting > div > span > span", ( /** @type {{ innerHTML: any; }} */ el) => el.innerHTML));
        console.log(`[${Zoom.name}] Meetings are spread over a number of pages. Found [${count}] records.`);
    } catch (error) {
        console.log(`[${Zoom.name}] This is a single page, grabbing current page data only.`);
    }
    return count;
}

async function _getForIncompleteRegisters() {
    throw messages.NOT_IMPLIMENTED;
}