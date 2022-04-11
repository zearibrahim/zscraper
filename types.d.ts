
/**
 * Interface type definition for a student.
 * defines one student part of the Zoom data scrapping.
 */
declare interface IZoomStudent {
    name: string;
    email: string;
    duration: string;
    guest: string;
}

/**
 * Interface type definition to for multiple students.
 * Requires {@link IZoomStudent}.
 */
declare interface IZoomStudents extends Array<IZoomStudent> { }

/**
 * Interface type definition for a Zoom Meeting.
 * Requires {@link IZoomStudents}.
 */
declare interface IZoomMeeting {
    id: string;
    class: string;
    date: string;
    timeFromTopic: string;
    host: string;
    students: IZoomStudents;
}

/**
 * Interface type definition for multiple Zoom Meetings.
 * Requires {@link IZoomMeeting}.
 */
interface IZoomMeetings extends Array<IZoomMeeting> { }