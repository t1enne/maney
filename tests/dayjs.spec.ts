import dayjs from "dayjs";

describe("dayjs tests", () => {
  const today = dayjs();
  const fmt = today.format("YYYY-MM-DD");
  expect(fmt).toBeTruthy();
});
