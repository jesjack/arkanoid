import React, {useEffect, useRef, useState} from 'react';
import {PanResponder, View} from 'react-native';
import {Rect} from 'react-native-svg';
import {PaddleProps} from '@/constants/paddle';
import Brick from "@/components/Brick";
import {getBrickCorners} from "@/logic/brickCorners";
import {BrickProps} from "@/constants/brick";

const Paddle: React.FC<PaddleProps> = ({bubble, offset, getPanResponder, getBrickCollision}) => {
    const paddleWidth = 100; // Ancho del paddle
    const {x, y, r, nucleus} = bubble;
    const [currentRotation, setCurrentRotation] = useState(0); // Estado para manejar la rotación del paddle
    const [ brickState, setBrickState ] = useState<BrickProps>({
        bubble,
        index: 0,
        offset,
        extraRotation: currentRotation,
        fixedWidth: paddleWidth,
        fixedDistance: nucleus + 10
    });

    const initialFingerX = useRef<number | undefined>(); // Posición inicial del dedo
    const initialFingerY = useRef<number | undefined>(); // Posición inicial del dedo

    const brickCorners = useRef(getBrickCorners(brickState)); // Obtener las esquinas del ladrillo

    // PanResponder para detectar el deslizamiento del dedo
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => { // using offset
            initialFingerX.current = gestureState.x0 - offset.x;
            initialFingerY.current = gestureState.y0 - offset.y;
        },
        onPanResponderMove: (evt, gestureState) => {
            if (initialFingerX.current === undefined || initialFingerY.current === undefined) {
                return;
            }

            const initialVector = {x: initialFingerX.current - x, y: initialFingerY.current - y};
            const currentVector = {
                x: gestureState.moveX - offset.x - x,
                y: gestureState.moveY - offset.y - y
            };

            const dotProduct = initialVector.x * currentVector.x + initialVector.y * currentVector.y;
            const magnitudeProduct = Math.sqrt(initialVector.x * initialVector.x + initialVector.y * initialVector.y) * Math.sqrt(currentVector.x * currentVector.x + currentVector.y * currentVector.y);
            const clampedDotProduct = Math.min(Math.max(dotProduct / magnitudeProduct, -1), 1);
            const angle = Math.acos(clampedDotProduct) * 180 / Math.PI;


            const crossProduct = initialVector.x * currentVector.y - initialVector.y * currentVector.x;
            const sign = crossProduct > 0 ? 1 : -1;

            setCurrentRotation((currentRotation) => {
                const newBrickState = {
                    ...brickState,
                    extraRotation: currentRotation + sign * angle
                };
                setBrickState(newBrickState);
                getBrickCollision(getBrickCorners(newBrickState));
                return currentRotation + sign * angle;
            });

            initialFingerX.current = gestureState.moveX - offset.x;
            initialFingerY.current = gestureState.moveY - offset.y;
        },
        onPanResponderRelease: () => {
            initialFingerX.current = undefined;
            initialFingerY.current = undefined;
        }
    });

    const responder = <View {...panResponder.panHandlers} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
    }}/>;

    useEffect(() => {
        getPanResponder(responder);
        getBrickCollision(brickCorners.current);
    }, []);

    return <>
        <Brick {...brickState} />
    </>;
};

export default Paddle;
