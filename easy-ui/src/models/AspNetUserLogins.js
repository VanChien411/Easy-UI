export default class AspNetUserLogin {
  constructor(loginProvider, providerKey, providerDisplayName, userId) {
    this.loginProvider = loginProvider;
    this.providerKey = providerKey;
    this.providerDisplayName = providerDisplayName;
    this.userId = userId;
  }

  static fromJson(json) {
    return new AspNetUserLogin(
      json.loginProvider,
      json.providerKey,
      json.providerDisplayName,
      json.userId
    );
  }

  static fromPartialJson(json) {
    return new AspNetUserLogin(
      json.loginProvider,
      json.providerKey,
      json.providerDisplayName,
      json.userId
    );
  }
}
