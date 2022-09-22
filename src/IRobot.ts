export default interface IRobot {
  kmDriver: number;
  position: { row: number; column: number };

  moveForward(): void;
  moveBack(): void;
  moveRight(): void;
  moveLeft(): void;
}
