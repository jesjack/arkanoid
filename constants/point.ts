export interface BrickCollision {
    brickIndex: number;
    corners: [Point, Point, Point, Point];
}

export interface Point {
    x: number;
    y: number;
}