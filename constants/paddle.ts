import {BubbleSemiProps} from "@/constants/bubble";
import {Offset} from "@/constants/offset";
import React from "react";
import {BrickCollision} from "@/constants/point";

export interface PaddleProps {
    bubble: BubbleSemiProps;
    offset: Offset;
    rotation: number;
    getPanResponder: (element: React.JSX.Element) => void;
    getBrickCollision: (brick: BrickCollision) => void;
}