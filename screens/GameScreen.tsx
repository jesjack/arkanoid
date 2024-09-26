// src/screens/GameScreen.js
import React, {useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import Ball from '../components/Ball';
import Svg from "react-native-svg";
import Bubble from "@/components/Bubble";
import Brick from "@/components/Brick";
import {offset, windowHeight, windowWidth} from "@/constants/offset";
import {bubble} from "@/constants/bubble";
import Paddle from "@/components/Paddle";
import {BrickCollision} from "@/constants/point";
import {BrickProps} from "@/constants/brick";
import {getBrickCorners} from "@/logic/brickCorners";

const GameScreen = () => {
    const [panResponder, setPanResponder] = React.useState<React.JSX.Element | null>(null);
    const [brickCollisionsState, setBrickCollisionsState] = React.useState<Array<BrickCollision>>([]);

    const bricksProps: Array<BrickProps> = [
        {bubble, index: 2, offset},
        {bubble, index: 20, offset},
        {bubble, index: 40, offset},
        {bubble, index: 60, offset},
        {bubble, index: 80, offset},
        {bubble, index: 100, offset},
        {bubble, index: 150, offset},
        {bubble, index: 200, offset},
        {bubble, index: 250, offset},
    ];
    const bricksCollisions = useRef<Array<BrickCollision>>(bricksProps.map((brick) => getBrickCorners(brick)));

    useEffect(() => {
        setBrickCollisionsState(bricksCollisions.current);
    });

    return <>
        <Svg width={windowWidth} height={windowHeight}>
            <Bubble
                {...bubble}
                offset={offset}
            />

            {bricksProps.map((brick) => <Brick {...brick} key={brick.index} />)}

            <Paddle bubble={bubble}
                    offset={offset}
                    rotation={0}
                    getPanResponder={(elm) => setPanResponder(elm)}
                    getBrickCollision={(brick) => {
                        const new_ = [
                            ...bricksCollisions.current.filter((brickCollision) => brickCollision.brickIndex !== brick.brickIndex),
                            brick
                        ];
                        bricksCollisions.current = new_;
                        setBrickCollisionsState(new_);
                    }}
            />
            <Ball
                limitBubble={bubble}
                offset={offset}
                obstacles={brickCollisionsState}
            />
        </Svg>
        {panResponder}
    </>;
};

export default GameScreen;
