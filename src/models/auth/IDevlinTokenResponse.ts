import IDiscordUserInfo from "./IDiscordUserInfo";

export default interface ITokenResponse {
    accessToken: string;
    tokenType: string;
    refreshToken?: string;
    profile?: IDiscordUserInfo;
}
