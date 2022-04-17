/**
 * Zoom class and functions for https://www.navitas.zoom.us.
 * @author Zear Ibrahim
 */
export default class Zoom {
    /**
     * Instantiate the Zoom object and org name.
     * @param {String} org
     */
    constructor(org: string);
    loginUrl: string;
    reportsUrl: string;
    /**
     * Login to Zoom using the provided credentials.
     * * NOTE: This login method requires a pre-configured authenticator such as mobile phone to approve the login attempt.
     * @param {Puppeteer.Page} page a blank puppeteer page.
     * @param {String} username a string username for {@link loginUrl} using {@type {Env}} entries.
     * @param {String} password a string password for {@link loginUrl} using {@type {Env}} entries.
     * @throws {@link messages.TIMEOUT} times out upon authentication failure.
     */
    login(page: Puppeteer.Page, username: string, password: string): Promise<void>;
    /**
     * Get meeting data from the Zoom reporting window.
     * @param {Puppeteer.Page} page a puppeteer page logged into Zoom.
     * @param {String} _from optional from date "mm/dd/yyyy".
     * @param {String} _to optional to date "mm/dd/yyyy".
     * @todo apply _from and _to date validation and ensure page is logged in.
     * @returns {Promise<import("./interfaces").IZoomMeetings>} data interface representing list of participants.
     */
    getMeetings(page: Puppeteer.Page, _from: string, _to: string): Promise<import("./interfaces").IZoomMeetings>;
}
import * as Puppeteer from "puppeteer";
//# sourceMappingURL=index.d.ts.map