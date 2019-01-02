import Vue from 'vue';
import router from "@/router";
import { Route } from 'vue-router';
import IDiscordAuthResult from '@/models/auth/IDiscordAuthResult';
import IRdeemedAuthResult from "@/models/auth/IRedeemedAuthResult";
import {ApiHttpClient} from "@/globals";

export interface IDiscordLoginProvider {
    performDiscordOAuth2Flow(): Promise<string>;

    redemptionWindowFlow(route: Route): Promise<boolean>;

    redeemCode(code: string): Promise<IRdeemedAuthResult>;
};

class DiscordLoginProvider implements IDiscordLoginProvider {

    public performDiscordOAuth2Flow(): Promise<string> {
        return new Promise((resolve, reject) => {            
            let url = "https://discordapp.com/api/oauth2/authorize";
            url += "?client_id=383108341196390401";
            url += "&redirect_uri=" + encodeURIComponent(window.location.origin) + "/auth/discord";
            url += "&response_type=code&scope=identify%20email%20guilds";

            const oAuthWindow = window.open(url, "dv.minerva.auth", "width=400,height=600,menubar=no");
            if (!oAuthWindow) {
                reject(new Error("Unable to open Discord Auth window"));
                return;
            }

            let resolved = false;
            window.onmessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) {
                    return;
                }

                const authResult = <IDiscordAuthResult>event.data;
                if (!authResult.oauthCode) {
                    return;
                }

                if (authResult.oauthCode) {
                    resolve(authResult.oauthCode);
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

    public redemptionWindowFlow(route: Route): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let error = route.query.error;
            if (error) {
                reject(new Error(error));
                return;
            }

            let code = route.query.code;
            if (code) {
                let opener = window.opener;
                if (!opener) {
                    reject("Unable to communicate with opener");
                    return;
                }

                let result: IDiscordAuthResult = {
                    oauthCode: code,
                };

                opener.postMessage(result, window.location.origin);
            } else {
                reject("Missing code");
            }
        });
    }

    public async redeemCode(code: string): Promise<IRdeemedAuthResult> {
        const resp = await ApiHttpClient.get<IRdeemedAuthResult>("/auth/discord?code=" + code);
        return resp.data;
    }
}

export default new DiscordLoginProvider() as IDiscordLoginProvider;