export default class AspNetUserToken {
  constructor(userId, loginProvider, name, value) {
    this.userId = userId;
    this.loginProvider = loginProvider;
    this.name = name;
    this.value = value;
  }

  static fromJson(json) {
    return new AspNetUserToken(
      json.userId,
      json.loginProvider,
      json.name,
      json.value
    );
  }
}
