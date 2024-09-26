import React from 'react';
import { Rect } from 'react-native-svg';
import { brickHeight, BrickProps, brickWidth, gap, maxRows, numberOfRadialLines } from "@/constants/brick";

const Brick: React.FC<BrickProps> = ({
    bubble: {
        x: bubbleX,
        y: bubbleY,
        r: radius,
    },
    offset: {
        x: offsetX,
        y: offsetY,
    },
    index,
    extraRotation = 0, // Valor por defecto de 0 si no se proporciona
    fixedWidth, // Ancho fijo opcional, sin valor por defecto
    fixedDistance, // Distancia fija desde el centro opcional
}) => {
    // Calcular la fila en la que debe ir el ladrillo y su índice en esa fila
    const row = Math.floor(index / numberOfRadialLines); // Fila basada en el índice
    const localIndex = index % numberOfRadialLines; // Índice del ladrillo dentro de la fila

    // Si el ladrillo está más allá de las filas permitidas, no lo renderizamos
    if (row >= maxRows) return null;

    // Si se proporciona `fixedWidth`, se usa ese valor, si no, se calcula el ancho decreciente
    const currentWidth = fixedWidth ?? Math.max(brickWidth * (1 - row / maxRows), 5); // Usa el ancho fijo si existe, sino ancho decreciente

    const baseAngle = (localIndex / numberOfRadialLines) * Math.PI * 2; // Ángulo base del ladrillo
    const angle = baseAngle + (extraRotation * Math.PI / 180); // Añadir rotación extra (convertida a radianes)

    // Usar `fixedDistance` si está proporcionado, sino calcular la distancia normalmente
    const distance = fixedDistance ?? (radius - row * (brickHeight + gap)); // Distancia fija o calculada

    const x = bubbleX + offsetX + Math.cos(angle) * distance; // Posición X del ladrillo
    const y = bubbleY + offsetY + Math.sin(angle) * distance; // Posición Y del ladrillo

    // Establece la rotación del ladrillo
    const rotation = angle * (180 / Math.PI) + 90; // Convierte a grados y ajusta 90 grados para mantenerlo horizontal

    return (
        <Rect
            x={x - currentWidth / 2} // Centra el ladrillo
            y={y - 2} // Ajusta la posición vertical del ladrillo
            width={currentWidth} // Ancho del ladrillo (puede ser fijo o dinámico)
            height={brickHeight} // Altura del ladrillo
            fill="brown"
            transform={`rotate(${rotation}, ${x}, ${y})`} // Rotación alrededor del centro
        />
    );
};

export default Brick;
