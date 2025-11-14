import { screen } from "@testing-library/dom";

export const getLoadingIndicator = () =>
  screen.queryByLabelText(/trwa ładowanie zasobu/i);
