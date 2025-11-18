export enum ApplicationError {
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
  NotImplemented = 501,
}

export enum ImageType {
  Logo = "logo",
  Banner = "banner",
}

// from https://github.com/Solvro/backend-topwr/blob/main/app/enums/weekday.ts
export enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}
