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
        // offset: {
        //     x: offsetX,
        //     y: offsetY,
        // },
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
    const centerX = bubbleX + /*offsetX*/ + Math.cos(angle) * distance;
    const centerY = bubbleY + /*offsetY*/ + Math.sin(angle) * distance;

    // Calcular los puntos esquina del ladrillo
    const halfWidth = currentWidth / 2;
    const halfHeight = brickHeight / 2;

    // Aplicar la rotación
    const corners: Point[] = [
        {x: centerX - halfWidth, y: centerY - halfHeight}, // Esquina superior izquierda
        {x: centerX + halfWidth, y: centerY - halfHeight}, // Esquina superior derecha
        {x: centerX + halfWidth, y: centerY + halfHeight}, // Esquina inferior derecha
        {x: centerX - halfWidth, y: centerY + halfHeight}, // Esquina inferior izquierda
    ];

    const cornersReturn: [Point, Point, Point, Point] = [
        {x: 0, y: 0}, // Esquina superior izquierda
        {x: 0, y: 0}, // Esquina superior derecha
        {x: 0, y: 0}, // Esquina inferior derecha
        {x: 0, y: 0}, // Esquina inferior izquierda
    ];

    const adjustedAngle = angle - Math.PI / 2;


    corners.forEach((corner, i) => {
        const relativeX = corner.x - centerX;
        const relativeY = corner.y - centerY;

        // return {
        //     x: centerX + (relativeX * Math.cos(angle) - relativeY * Math.sin(angle)),
        //     y: centerY + (relativeX * Math.sin(angle) + relativeY * Math.cos(angle)),
        // };
        cornersReturn[i] = {
            x: centerX + (relativeX * Math.cos(adjustedAngle) - relativeY * Math.sin(adjustedAngle)),
            y: centerY + (relativeX * Math.sin(adjustedAngle) + relativeY * Math.cos(adjustedAngle)),
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

export function distanciaPuntoLinea(p: Point, line: [Point, Point]): number {
    const { x: px, y: py } = p;
    const [ { x: l1x, y: l1y }, { x: l2x, y: l2y } ] = line;

    // Vector PL1
    const pl1_x = px - l1x;
    const pl1_y = py - l1y;

    // Vector L1L2
    const l1l2_x = l2x - l1x;
    const l1l2_y = l2y - l1y;

    // Magnitud al cuadrado de L1L2
    const l1l2_mag_sq = l1l2_x ** 2 + l1l2_y ** 2;

    // Producto punto de PL1 y L1L2
    const dot_product = pl1_x * l1l2_x + pl1_y * l1l2_y;

    // Factor de proyección t
    let t = dot_product / l1l2_mag_sq;

    // Clamping t entre 0 y 1
    t = Math.max(0, Math.min(1, t));

    // Coordenadas del punto proyectado
    const x_cercano = l1x + t * l1l2_x;
    const y_cercano = l1y + t * l1l2_y;

    // Distancia euclidiana entre el punto y el punto más cercano
    const distancia = Math.sqrt((px - x_cercano) ** 2 + (py - y_cercano) ** 2);

    return distancia;
}

export const calcularRebote = ({ vx, vy }: {
    vx: number,
    vy: number,
}, normalX: number, normalY: number) => {
    // Normalizamos el vector normal
    const normalMagnitude = Math.sqrt(normalX ** 2 + normalY ** 2);
    const normalizedNormalX = normalX / normalMagnitude;
    const normalizedNormalY = normalY / normalMagnitude;

    // Producto punto entre velocidad y la normal
    const dotProduct = vx * normalizedNormalX + vy * normalizedNormalY;

    // Nueva velocidad después del rebote
    const newVx = vx - 2 * dotProduct * normalizedNormalX;
    const newVy = vy - 2 * dotProduct * normalizedNormalY;

    return { newVx, newVy };
};