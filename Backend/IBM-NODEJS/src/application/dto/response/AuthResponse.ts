export class AuthResponse {
    token: TokenInfo;
    user_information: SoapData;

    constructor(
        token: TokenInfo,
        user_information: SoapData
    ) {
        this.token = token;
        this.user_information = user_information;
    }
}

export class TokenInfo {
    token: string;
    type: string;

    constructor(
        token: string,
        type: string
    ) {
        this.token = token;
        this.type = type;
    }
}

export class SoapData {
    resultCode: number;
    firstName: string;
    lastName: string;
    age: number;
    profilePhoto: string;
    video: string;

    constructor(
        resultCode: number,
        firstName: string,
        lastName: string,
        age: number,
        profilePhoto: string,
        video: string
    ) {
        this.resultCode = resultCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.profilePhoto = profilePhoto;
        this.video = video;
    }
}
