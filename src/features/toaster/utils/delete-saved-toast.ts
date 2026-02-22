import Cookies from "js-cookie";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";

export const deleteSavedToast = () => {
  Cookies.remove(SAVED_TOAST_COOKIE_NAME);
};
