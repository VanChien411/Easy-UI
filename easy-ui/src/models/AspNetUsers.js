export default class AspNetUser {
  constructor(
    id,
    userName = null,
    normalizedUserName = null,
    email = null,
    normalizedEmail = null,
    emailConfirmed = false,
    passwordHash = null,
    securityStamp = null,
    concurrencyStamp = null,
    phoneNumber = null,
    phoneNumberConfirmed = false,
    twoFactorEnabled = false,
    lockoutEnd = null,
    lockoutEnabled = true,
    accessFailedCount = 0
  ) {
    this.id = id;
    this.userName = userName;
    this.normalizedUserName = normalizedUserName;
    this.email = email;
    this.normalizedEmail = normalizedEmail;
    this.emailConfirmed = emailConfirmed;
    this.passwordHash = passwordHash;
    this.securityStamp = securityStamp;
    this.concurrencyStamp = concurrencyStamp;
    this.phoneNumber = phoneNumber;
    this.phoneNumberConfirmed = phoneNumberConfirmed;
    this.twoFactorEnabled = twoFactorEnabled;
    this.lockoutEnd = lockoutEnd;
    this.lockoutEnabled = lockoutEnabled;
    this.accessFailedCount = accessFailedCount;
  }

  static fromJson(json) {
    return new AspNetUser(
      json.id,
      json.userName,
      json.normalizedUserName,
      json.email,
      json.normalizedEmail,
      json.emailConfirmed,
      json.passwordHash,
      json.securityStamp,
      json.concurrencyStamp,
      json.phoneNumber,
      json.phoneNumberConfirmed,
      json.twoFactorEnabled,
      json.lockoutEnd,
      json.lockoutEnabled,
      json.accessFailedCount
    );
  }

  static fromPartialJson(json) {
    return new AspNetUser(
      json.id,
      json.userName,
      json.normalizedUserName,
      json.email,
      json.normalizedEmail,
      json.emailConfirmed,
      json.passwordHash,
      json.securityStamp,
      json.concurrencyStamp,
      json.phoneNumber,
      json.phoneNumberConfirmed,
      json.twoFactorEnabled,
      null, // lockoutEnd
      json.lockoutEnabled,
      json.accessFailedCount
    );
  }
}
