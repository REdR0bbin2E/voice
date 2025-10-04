// auth0.ts
import Auth0 from 'react-native-auth0';

export const auth0 = new Auth0({
    domain: 'dev-iuubo1tzok0w64at.us.auth0.com',      // e.g., 'dev-xxxx.us.auth0.com'
    clientId: '4EJs10tZjEYMxk4evP0JRB3b0qFtpvhZ', // from your Auth0 application
});
export default auth0;
