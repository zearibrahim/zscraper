
/**
 * Interface type definition for a participant.
 * defines one participant part of the Zoom data scrapping.
 */
declare interface IZoomParticipant {
    name: string;
    email: string;
    duration: string;
    guest: string;
}

/**
 * Interface type definition to for multiple participants.
 * Requires {@link IZoomParticipant}.
 */
declare interface IZoomParticipants extends Array<IZoomParticipant> { }

/**
 * Interface type definition for a Zoom Meeting.
 * Requires {@link IZoomParticipants}.
 */
declare interface IZoomMeeting {
    id: string;
    topic: string;
    date: string;
    timeFromTopic: string;
    host: string;
    participants: IZoomParticipants;
}

/**
 * Interface type definition for multiple Zoom Meetings.
 * Requires {@link IZoomMeeting}.
 */
interface IZoomMeetings extends Array<IZoomMeeting> { }