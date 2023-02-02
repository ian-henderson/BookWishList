import formatNames from "./formatNames";

describe("utils/formatNames", () => {
  test("handles empty array", () => expect(formatNames([])).toMatch(""));

  test("handles one name", () =>
    expect(formatNames(["John Smith"])).toMatch("John Smith"));

  test("handles two names", () =>
    expect(formatNames(["Thelma", "Louise"])).toMatch("Thelma and Louise"));

  test("handles single 'backwards' name", () =>
    expect(formatNames(["Shmoe, Joe"])).toMatch("Joe Shmoe"));

  test("handles 'backwards' name and normal name", () =>
    expect(formatNames(["Shmoe, Joe", "John Deer"])).toMatch(
      "Joe Shmoe and John Deer"
    ));

  test("handles single 'backwards' name, and two additional names", () =>
    expect(formatNames(["Shmoe, Joe", "John Deer", "John Cleese"])).toMatch(
      "Joe Shmoe, John Deer, and John Cleese"
    ));
});
