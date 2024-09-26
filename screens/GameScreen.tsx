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
    // const [brickCollision, setBrickCollision] = React.useState<BrickCollision | null>(null);

    /**
     * <Brick bubble={bubble} index={2} offset={offset} />
     *             <Brick bubble={bubble} index={20} offset={offset} />
     *             <Brick bubble={bubble} index={40} offset={offset} />
     */
    const bricksProps: Array<BrickProps> = [
        {bubble, index: 2, offset},
        {bubble, index: 20, offset},
        {bubble, index: 40, offset},
    ];
    const bricksCollisions = useRef<Array<BrickCollision>>(bricksProps.map((brick) => getBrickCorners(brick)));

    useEffect(() => {
        setBrickCollisionsState(bricksCollisions.current);
    });

    return <>
        <Svg width={windowWidth} height={windowHeight}>
            <Ball
                limitBubble={bubble}
                offset={offset}
                obstacles={bricksCollisions.current}
            />
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
                        if (!bricksCollisions.current) {
                            return;
                        }

                        if (!bricksCollisions.current.some((brickCollision) => brickCollision.brickIndex === brick.brickIndex)) {
                            return;
                        }

                        // push this brickCollision to the state
                        bricksCollisions.current = [
                            ...bricksCollisions.current.filter((brickCollision) => brickCollision.brickIndex !== brick.brickIndex),
                            brick
                        ];
                    }}
            />
        </Svg>
        {panResponder}
    </>;
};

export default GameScreen;
