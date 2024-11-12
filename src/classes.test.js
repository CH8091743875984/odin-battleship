import { Ship } from "./classes";

test("create Ship object of length 4", () => {
  const destroyer = new Ship(4);
  expect(destroyer.length).toBe(4);
});
test("confirm hit count is 1 after one hit on ship object", () => {
  const destroyer = new Ship(4);
  destroyer.hit();
  expect(destroyer.hitCount).toBe(1);
});
test("confirm sunk status remains False until 3/3 hits made on ship object of length 3", () => {
  const submarine = new Ship(3);
  submarine.hit();
  expect(submarine.sunk).toBe(false);
  submarine.hit();
  expect(submarine.sunk).toBe(false);
  submarine.hit();
  expect(submarine.sunk).toBe(true);
});
