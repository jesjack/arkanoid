// Bubble.tsx
import React from 'react';
import { Circle, Line, Rect } from "react-native-svg";
import {BubbleProps} from "@/constants/bubble";

const Bubble = ({
    x: bubbleX,
    y: bubbleY,
    r: bubbleRadius,
    offset: {
        x: offsetX,
        y: offsetY
    },
    nucleus,
}: BubbleProps) => {

    return (
        <>
            <Circle
                cx={bubbleX + offsetX}
                cy={bubbleY + offsetY}
                r={bubbleRadius}
                fill="transparent"
                stroke="black"
            />
            <Circle
                cx={bubbleX + offsetX}
                cy={bubbleY + offsetY}
                r={nucleus}
                fill="black"
            />
        </>
    );
}

export default Bubble;
