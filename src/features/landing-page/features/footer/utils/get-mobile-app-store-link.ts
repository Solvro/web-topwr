import { MOBILE_APP_STORE_LINKS } from "../constants";

export const getMobileAppStoreLink = (operatingSystemName?: string) =>
  MOBILE_APP_STORE_LINKS.find(
    ({ operatingSystem }) => operatingSystem === operatingSystemName,
  );
