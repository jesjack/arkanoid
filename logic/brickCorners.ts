import {brickHeight, BrickProps, brickWidth, gap, maxRows, numberOfRadialLines} from "@/constants/brick";
import {BrickCollision, Point} from "@/constants/point";

export function getBrickCorners(brickProps: BrickProps): BrickCollision {
    const {
        bubble: {
            x: bubbleX,
            y: bubbleY,
            r: radius,
        },
        index,
        offset: {
            x: offsetX,
            y: offsetY,
        },
        extraRotation = 0,
        fixedWidth,
        fixedDistance,
    } = brickProps;

    const row = Math.floor(index / numberOfRadialLines);
    const localIndex = index % numberOfRadialLines;

    const currentWidth = fixedWidth ?? Math.max(brickWidth * (1 - row / maxRows), 5);
    const distance = fixedDistance ?? (radius - row * (brickHeight + gap));

    const baseAngle = (localIndex / numberOfRadialLines) * Math.PI * 2;
    const angle = baseAngle + (extraRotation * Math.PI / 180);

    // Calcular la posición del ladrillo
    const centerX = bubbleX + offsetX + Math.cos(angle) * distance;
    const centerY = bubbleY + offsetY + Math.sin(angle) * distance;

    // Calcular los puntos esquina del ladrillo
    const halfWidth = currentWidth / 2;
    const halfHeight = brickHeight / 2;

    // Aplicar la rotación
    const corners: Point[] = [
        { x: centerX - halfWidth, y: centerY - halfHeight }, // Esquina superior izquierda
        { x: centerX + halfWidth, y: centerY - halfHeight }, // Esquina superior derecha
        { x: centerX + halfWidth, y: centerY + halfHeight }, // Esquina inferior derecha
        { x: centerX - halfWidth, y: centerY + halfHeight }, // Esquina inferior izquierda
    ];

    const cornersReturn: [Point, Point, Point, Point] = [
        { x: 0, y: 0 }, // Esquina superior izquierda
        { x: 0, y: 0 }, // Esquina superior derecha
        { x: 0, y: 0 }, // Esquina inferior derecha
        { x: 0, y: 0 }, // Esquina inferior izquierda
    ];

    corners.forEach((corner, i) => {
        const relativeX = corner.x - centerX;
        const relativeY = corner.y - centerY;

        // return {
        //     x: centerX + (relativeX * Math.cos(angle) - relativeY * Math.sin(angle)),
        //     y: centerY + (relativeX * Math.sin(angle) + relativeY * Math.cos(angle)),
        // };
        cornersReturn[i] = {
            x: centerX + (relativeX * Math.cos(angle) - relativeY * Math.sin(angle)),
            y: centerY + (relativeX * Math.sin(angle) + relativeY * Math.cos(angle)),
        };
    });

    if (cornersReturn.length !== 4) {
        throw new Error("Error al rotar los puntos del ladrillo");
    }

    // Rotar los puntos alrededor del centro
    return {
        brickIndex: index,
        corners: cornersReturn,
    };
}
