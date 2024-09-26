import React, { useState, useEffect, useRef } from 'react';
import { BallProps, ballRadius, initialBallPosition, initialBallVelocity } from "@/constants/ball";
import { Circle, Text } from "react-native-svg";
import {GRAVITY_CONSTANT} from "@/constants/bubble";
import {Point} from "@/constants/point";

const Ball = ({
    limitBubble: {
        x: bubbleX,
        y: bubbleY,
        r: bubbleRadius,
        nucleus: bubbleNucleus
    },
    offset: {
        x: offsetX,
        y: offsetY
    },
    obstacles
}: BallProps) => {
    const [position, setPosition] = useState({ x: initialBallPosition[0], y: initialBallPosition[1] });
    const [velocity, setVelocity] = useState({ vx: initialBallVelocity[0], vy: initialBallVelocity[1] });

    const positionRef = useRef(position);
    const velocityRef = useRef(velocity);

    useEffect(() => {
        const interval = setInterval(() => {
            updateBallPosition();
        }, 8); // Aproximadamente 120 FPS

        return () => clearInterval(interval);
    }, []); // No hay dependencias aquí

    const updateBallPosition = () => {
        const { x, y } = positionRef.current;
        const { vx, vy } = velocityRef.current;

        // Calcular la distancia desde el centro de la burbuja (punto gravitatorio)
        const dx = bubbleX - x;
        const dy = bubbleY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            positionRef.current = { x: x + vx, y: y + vy };
            setPosition({ x: x + vx, y: y + vy });
            return;
        }

        // Calcular la fuerza de gravedad
        const force = GRAVITY_CONSTANT / distance;
        const fx = force * dx;
        const fy = force * dy;

        // Calcular la nueva velocidad
        const newVx = vx + fx;
        const newVy = vy + fy;

        // Calcular la nueva posición
        const newX = x + newVx;
        const newY = y + newVy;

        // Actualizar la posición y velocidad en refs
        positionRef.current = { x: newX, y: newY };
        velocityRef.current = { vx: newVx, vy: newVy };
        setPosition({ x: newX, y: newY });
        setVelocity({ vx: newVx, vy: newVy });

        // Rebote con el núcleo de la burbuja
        if (distance < bubbleNucleus + ballRadius) {
            const normalX = x;
            const normalY = y;
            const normalMagnitude = Math.sqrt(normalX ** 2 + normalY ** 2);
            const normalizedNormalX = normalX / normalMagnitude;
            const normalizedNormalY = normalY / normalMagnitude;
            const dotProduct = vx * normalizedNormalX + vy * normalizedNormalY;

            const newVx = vx - 2 * dotProduct * normalizedNormalX;
            const newVy = vy - 2 * dotProduct * normalizedNormalY;

            positionRef.current = { x: x + newVx, y: y + newVy };
            velocityRef.current = { vx: newVx, vy: newVy };
            setPosition({ x: x + newVx, y: y + newVy });
        }
    };


    // Validar que la posición no sea NaN
    if (isNaN(position.x) || isNaN(position.y)) {
        return null; // Si es NaN, no renderizar el círculo
    }

    return (
        <>
            <Circle cx={position.x + offsetX} cy={position.y + offsetY} r={ballRadius} fill="blue" />
            {/* Valores para debug */}
            <Text x="10" y="20" fontSize="16" fill="black">
                Posición: ({position.x.toFixed(2)}, {position.y.toFixed(2)})
            </Text>
            <Text x="10" y="40" fontSize="16" fill="black">
                Velocidad: ({velocity.vx.toFixed(2)}, {velocity.vy.toFixed(2)})
            </Text>
        </>
    );
};

export default Ball;
