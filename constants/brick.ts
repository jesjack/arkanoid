import {BubbleSemiProps} from "@/constants/bubble";
import {Offset} from "@/constants/offset";

export interface BrickProps {
    bubble: BubbleSemiProps;
    index: number; // Índice del ladrillo global
    offset: Offset;
    extraRotation?: number; // Rotación extra opcional
    fixedWidth?: number; // Ancho fijo opcional
    fixedDistance?: number; // Distancia fija desde el centro opcional
}

export const brickHeight = 8; // Altura de los ladrillos
export const gap = 3; // Espacio entre ladrillos
export const numberOfRadialLines = 30; // Cantidad de líneas radiales (ladrillos por fila)
export const brickWidth = 30; // Ancho base de los ladrillos
export const maxRows = 10; // Máximo número de filas