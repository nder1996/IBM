export class AuthResponse {
    constructor(
        public token?: TokenInfo,
        public user_information?: SoapData
    ) {}
}

export class TokenInfo {
    constructor(
        public token?: string,
        public type?: string
    ) {}
}

export class SoapData {
    constructor(
        public resultCode?: number,
        public firstName?: string,
        public lastName?: string,
        public age?: number,
        public profilePhoto?: string,
        public video?: string
    ) {}
}
