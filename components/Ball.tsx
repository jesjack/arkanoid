import React, {useState, useEffect, useRef} from 'react';
import {BallProps, ballRadius, initialBallPosition, initialBallVelocity} from "@/constants/ball";
import {Circle, Text} from "react-native-svg";
import {GRAVITY_CONSTANT} from "@/constants/bubble";
import {Point} from "@/constants/point";
import {calcularRebote, distanciaPuntoLinea} from "@/logic/brickCorners";

let timeAviable = true;
setInterval(() => {
    timeAviable = true;
}, 1000);

interface BallMemoProps {
    position: Point;
    ballRadius: number;
    offsetX: number;
    offsetY: number;
}

// Componente Ball que solo se re-renderiza cuando cambia su posición
const Ball = React.memo<BallMemoProps>(({position, ballRadius, offsetX, offsetY}) => {
    return (
        <Circle cx={position.x + offsetX} cy={position.y + offsetY} r={ballRadius} fill="blue"/>
    );
});

// Componente principal que maneja la lógica del movimiento de la pelota
const BallContainer = ({
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
    const [position, setPosition] = useState({x: initialBallPosition[0], y: initialBallPosition[1]});
    const [velocity, setVelocity] = useState({vx: initialBallVelocity[0], vy: initialBallVelocity[1]});

    const positionRef = useRef(position);
    const velocityRef = useRef(velocity);

    useEffect(() => {
        const interval = setInterval(() => {
            updateBallPosition();
        }, 8); // Aproximadamente 120 FPS

        return () => clearInterval(interval);
    }, []); // No hay dependencias aquí

    const obstaclesRef = useRef(obstacles);
    useEffect(() => {
        obstaclesRef.current = obstacles;
    }, [obstacles]);


    const updateBallPosition = () => {
        const {x, y} = positionRef.current;
        const {vx, vy} = velocityRef.current;

        // Calcular la distancia desde el centro de la burbuja (punto gravitatorio)
        const dx = bubbleX - x;
        const dy = bubbleY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            positionRef.current = {x: x + vx, y: y + vy};
            setPosition({x: x + vx, y: y + vy});
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
        positionRef.current = {x: newX, y: newY};
        velocityRef.current = {vx: newVx, vy: newVy};
        setPosition({x: newX, y: newY});

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

            positionRef.current = {x: x + newVx, y: y + newVy};
            velocityRef.current = {vx: newVx, vy: newVy};
            setPosition({x: x + newVx, y: y + newVy});
        }

        // Rebote con los obstáculos
        obstaclesRef.current.forEach(({corners}) => {
            const lines = [
                {x1: corners[0].x, y1: corners[0].y, x2: corners[1].x, y2: corners[1].y},
                {x1: corners[1].x, y1: corners[1].y, x2: corners[2].x, y2: corners[2].y},
                {x1: corners[2].x, y1: corners[2].y, x2: corners[3].x, y2: corners[3].y},
                {x1: corners[3].x, y1: corners[3].y, x2: corners[0].x, y2: corners[0].y},
            ];

            lines.forEach(({x1, y1, x2, y2}) => {
                const lineaDistancia = distanciaPuntoLinea({x, y}, [{x: x1, y: y1}, {x: x2, y: y2}]);

                if (lineaDistancia < ballRadius) {
                    // console.log("Colisión con línea");

                    // Calcular la normal de la línea (perpendicular)
                    const normalX = y2 - y1; // -dy para obtener la normal
                    const normalY = x1 - x2; // dx para obtener la normal

                    // Calcular la nueva velocidad
                    const {newVx, newVy} = calcularRebote({vx, vy}, normalX, normalY);

                    // Actualizar refs de posición y velocidad
                    positionRef.current = {x: x + newVx, y: y + newVy};
                    velocityRef.current = {vx: newVx, vy: newVy};
                    setPosition({x: x + newVx, y: y + newVy});
                }
            });
        });

    };

    // Validar que la posición no sea NaN
    if (isNaN(position.x) || isNaN(position.y)) {
        return null; // Si es NaN, no renderizar el círculo
    }

    return (
        <>
            {/* Solo la pelota */}
            <Ball position={position} ballRadius={ballRadius} offsetX={offsetX} offsetY={offsetY}/>
            {obstacles.map((obstacle, index) => {
                return (
                    <React.Fragment key={index}>
                        <Circle cx={obstacle.corners[0].x} cy={obstacle.corners[0].y} r={2} fill="red"/>
                        <Circle cx={obstacle.corners[1].x} cy={obstacle.corners[1].y} r={2} fill="red"/>
                        <Circle cx={obstacle.corners[2].x} cy={obstacle.corners[2].y} r={2} fill="red"/>
                        <Circle cx={obstacle.corners[3].x} cy={obstacle.corners[3].y} r={2} fill="red"/>
                    </React.Fragment>
                );
            })}

            {/* Texto de debug que no se vuelve a renderizar con la pelota */}
            {/*<Text x="10" y="20" fontSize="16" fill="black">*/}
            {/*    Posición: ({position.x.toFixed(2)}, {position.y.toFixed(2)})*/}
            {/*</Text>*/}
            {/*<Text x="10" y="40" fontSize="16" fill="black">*/}
            {/*    Velocidad: ({velocity.vx.toFixed(2)}, {velocity.vy.toFixed(2)})*/}
            {/*</Text>*/}
        </>
    );
};

export default BallContainer;
