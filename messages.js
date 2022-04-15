/**
 * Login Required Error
 * Thrown when a user tries to access a resource that requires a login and not
 * already authenticated
 */
export const LOGIN_REQUIRED = new Error("Login Required");

/**
 * Invalid Credentials Error
 * Thrown when a user tries to login with invalid credentials
 */
export const INVALID_CREDENTIALS = new Error("Invalid Credentials");

/**
 * Succesful Authentication Message
 * Printed when a successfully logged into the service
 */
export const SUCCESS_LOGIN = "Logged in Successfully";

/**
 * Credentials Timeout Error
 * Thrown when the Microsoft Authenticator times out
 */
export const TIMEOUT = new Error("Microsoft Authenticator Timed Out or Failed To Log You In");

/**
 * Not Implimented Error
 * Thrown when a user tries to access a resource that is not yet implimented
 */
export const NOT_IMPLIMENTED = new Error("Function Not Yet Implimented");