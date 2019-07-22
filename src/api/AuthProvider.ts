import jwt from 'jsonwebtoken';
import IDevlinTokenResponse from '@/models/auth/IDevlinTokenResponse';

export interface IAuthProvider {
    performDevlinOAuth2Flow(): Promise<IDevlinTokenResponse>;
}

export const I: string =  'ZGV2bGluLmRpdmluaXRvci5jb20=';
export const P: string = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUhZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUNJRFlnQUVST1ZITVZUQTkzZHpHVk5ROUZpOFZ3WTV3eVdJT0IyZVVuSmlPNU54SWozOE04Z1JHRlkrU2VFTGk0bklUUDYxNThxYmVuZEhDTHVtMEpjaW9oTlRJQlpjbjhlZ3g4b081YlVadlJuaGRSS0ZBWEdQTmxzMXRJSWVsL3FBdXhzSQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0="

class AuthProvider implements IAuthProvider {

    private AUTH_URL: string = 'aHR0cHM6Ly9kZXZsaW4uZGl2aW5pdG9yLmNvbS9sb2dpbj9hPQ==';

    public performDevlinOAuth2Flow(): Promise<IDevlinTokenResponse> {
        return new Promise((resolve, reject) => {
            let url = atob(this.AUTH_URL) + process.env.VUE_APP_DEVLIN_APP_ID;
            url += "&o=" + encodeURIComponent(window.location.origin);

            const oAuthWindow = window.open(url, "dv.devlin.auth", "width=400,height=600,menubar=no");
            if (!oAuthWindow) {
                reject(new Error("Unable to open Devlin Auth window"));
                return;
            }

            let resolved = false;
            window.onmessage = (event: MessageEvent) => {
                if (event.origin !== 'https://devlin.divinitor.com') {
                    console.error('Origin mismatch', event.origin);
                    return;
                }

                const authResult = <IDevlinTokenResponse>event.data;
                if (!authResult.accessToken) {
                    console.error('No token');
                    return;
                }

                if (authResult.accessToken) {
                    // Validate it
                    try {
                        jwt.verify(authResult.accessToken, atob(P), {
                            algorithms: ['ES384'],
                            issuer: atob(I),
                            clockTolerance: 30000,
                            audience: process.env.VUE_APP_DEVLIN_APP_ID,
                        });
                    } catch (error) {
                        console.error('Invalid token', error, authResult.accessToken);
                        reject(new Error('Invalid token'));
                        return;
                    }

                    resolve(authResult);
                    resolved = true;
                    oAuthWindow.close();
                }
            };

            // https://stackoverflow.com/a/48240128
            let timer = setInterval(() => {
                if (oAuthWindow.closed) {
                    clearInterval(timer);

                    if (resolved) {
                        return;
                    }

                    reject(new Error("Login cancelled"));
                }
            }, 1000);
        });
    }
}

export default new AuthProvider() as IAuthProvider;
