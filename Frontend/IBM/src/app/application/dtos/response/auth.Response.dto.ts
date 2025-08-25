export class AuthResponse {
  token?: TokenInfo;
  userInformation?: UserProfileResponseDto;

  constructor(
    token?: TokenInfo,
    userInformation?: UserProfileResponseDto
  ) {
    this.token = token;
    this.userInformation = userInformation;
  }
}

export class TokenInfo {
  token?: string;
  type?: string = "Bearer";

}

export class UserProfileResponseDto {
  constructor(
    public resultCode?: number,
    public firstName?: string,
    public lastName?: string,
    public age?: string,
    public profilePhoto?: string,
    public video?: string
  ) { }
}
