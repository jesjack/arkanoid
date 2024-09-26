import {BubbleSemiProps} from "@/constants/bubble";
import {Offset} from "@/constants/offset";
import {BrickCollision, Point} from "@/constants/point";

export const ballRadius = 4;

export const initialBallPosition = [0, 200, 0];

export const initialBallVelocity = [.1, 0, 0];

export interface BallSemiProps {
    limitBubble: BubbleSemiProps;
    obstacles: Array<BrickCollision>; // los ladrillos pues
}

export interface BallProps extends BallSemiProps {
    offset: Offset
}