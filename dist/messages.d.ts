/**
 * Login Required Error
 * Thrown when a user tries to access a resource that requires a login and not
 * already authenticated
 */
export const LOGIN_REQUIRED: Error;
/**
 * Invalid Credentials Error
 * Thrown when a user tries to login with invalid credentials
 */
export const INVALID_CREDENTIALS: Error;
/**
 * Succesful Authentication Message
 * Printed when a successfully logged into the service
 */
export const SUCCESS_LOGIN: "Logged in Successfully";
/**
 * Credentials Timeout Error
 * Thrown when the Microsoft Authenticator times out
 */
export const TIMEOUT: Error;
/**
 * Not Implimented Error
 * Thrown when a user tries to access a resource that is not yet implimented
 */
export const NOT_IMPLIMENTED: Error;
//# sourceMappingURL=messages.d.ts.map