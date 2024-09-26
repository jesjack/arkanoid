import {Offset, windowHeight, windowWidth} from "@/constants/offset";

export interface BubbleSemiProps {
    x: number;
    y: number;
    r: number;
    nucleus: number;
}

export interface BubbleProps extends BubbleSemiProps {
    offset: Offset;
}

export const bubble: BubbleSemiProps = {
    x: 0,
    y: 0,
    r: 200,
    nucleus: 50
};

export const GRAVITY_CONSTANT = 0.03; // Constante ajustable para la gravedad