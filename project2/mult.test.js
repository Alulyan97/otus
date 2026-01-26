const mult = require("./mult");

test("lets check the multiplication of 5 by 10 and the result should be 50", () => {
  expect(mult(5, 10)).toBe(50);
});
