# zscraper

Node.js module to scrape Zoom participant data manually using [Puppeteer](https://github.com/puppeteer/puppeteer).

## Notes

This module scrapes Zoom conference participant data by visiting the [reporting pages](https://zoom.us/account/my/report) for your organisation. Authentication is handled manually and requires users to approve the login attempt through a pre-configured authenticator app.

This module maybe useful for users when:
* They cannot configure or use the Zoom API,
* The Zoom account is restricted by their organisation:
    * Microsoft Active Directory prevents them from authorising their application,
    * Microsoft Active Directory/2FA authentication policy prevents them from requesting TOTP tokens in their application,
    * The account has API limits or is not part of a Zoom Pro Plan.

## Installation
```sh
$ npm i zscraper
```

## Example
### Import ZoomScraper and Puppeteer modules
```js
import ZoomScraper from "zscraper";
import Puppeteer from "puppeteer";
```

### Create a Puppeteer Instance
```js
// Setup Puppeteer options
const puppeteerOptions = {
    headless: false,
    defaultViewport: null,
};

// Creates puppeteer/chromium instance
const browser = await Puppeteer.launch(puppeteerOptions);
const page = await browser.newPage();
```

### Create a ZoomScraper Instance
    Note: Organisation must hold an active Zoom license
```js
// Instantiate scraper with your organisations' name
const zoom = new ZoomScraper("navitas");
```

### Login To Zoom
In this version, the Zoom `login` method requires manual approval through a pre-configured authenticator such as a mobile phone. If no approval is given, this method will time out.
```js
// Login to given organisation with user name and password
await zoom.login(page, ZOOM_ID, ZOOM_PASSWORD);
```
### Retrieve Meeting Data
This method returns all meetings between the given dates in `mm/dd/yyyy` format.

```js
// Get meetings as custom data object between _from and _to dates.
const meetings = await zoom.getMeetings(page, "04/01/2022", "04/03/2022");
```
### Output
Once pupulated, the meeting object may be printed in accordance with the [Meeting Interface Types](#meeting-interface-types).
```js
// Print all details
console.log(meetings[0]);

// or

// Print host email for particular meeting
console.log(meetings[0].host);

// or

// Print participant details for particular meeting
console.log(meetings[0].participants);
```
### Meeting Interface Types
The `meetings` object holds a list of meetings represented by the `IZoomMeetings` interface type. 

```ts
interface IZoomMeetings extends Array<IZoomMeeting> { }
```

Individual meetings are represented by the `IZoomMeeting` interface type.
```ts
interface IZoomMeeting {
    id: string;
    topic: string;
    date: string;
    timeFromTopic: string;
    host: string;
    participants: IZoomParticipants;
}
```

The `participants` property in `IZoomMeeting` holds a list of paticipants represented by the `IZoomParticipants` interface type. 

```ts
interface IZoomParticipants extends Array<IZoomParticipant> { }
```

A single participant is represented through the `IZoomParticipant` interface type:
```ts
interface IZoomParticipant {
    name: string;
    email: string;
    duration: string;
    guest: string;
}
```

## How To Run
Place the [example](#example) code in an `index.js` file at the `root` of a new Node.js project. 

```sh
$ node index.js

# or if running with .env variables

$ node -r dotenv/config index.js
```

## Licence
MIT © [Zear Ibrahim](https://www.brunel.ac.uk/people/zear-ibrahim1)