export default interface IJwtTokenBase {
    sub: string;
    nbf: number;
    iss: string;
    exp: number;
    nonce: string;
    iat: number;
}
