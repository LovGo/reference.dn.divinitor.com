export default interface IToken {
    sub: string;
    nbf: number;
    dsid: string;
    iss: string;
    exp: number;
    nonce: string;
    iat: number;
    username: string;
    avatar: string|null;
};
