export default class User {
  private accessCode: string | undefined;
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  readonly appUserId: string | number | undefined;

  constructor(
    appUserId: string | number, 
    accessCode?: string, 
    accessToken?: string, 
    refreshToken?: string
  ) {
    this.appUserId = appUserId;

    if (accessCode) this.accessCode = accessCode;
    if (accessToken) this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  getId() {
    return this.appUserId;
  }

  getAccessCode() {
    return this.accessCode;
  }

  getTokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    }
  }
}