import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders initial text elements", () => {
  render(<App />);
  expect(screen.getByText("View (0)")).toBeInTheDocument();
  expect(screen.getByText("List is empty...")).toBeInTheDocument();
  expect(screen.getByText("{ isFetching: true, page: 0 }")).toBeInTheDocument();
});
