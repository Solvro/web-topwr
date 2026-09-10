const PHONE_NUMBER_REGEX = /^\+?[0-9\s\-()]{6,20}$/;

export const isPhoneNumber = (value: string): boolean =>
  PHONE_NUMBER_REGEX.test(value);
