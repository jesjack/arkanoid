import {Dimensions} from "react-native";

export interface Offset {
    x: number;
    y: number;
}

export const {
    width: windowWidth,
    height: windowHeight
} = Dimensions.get('window');

export const offset: Offset = {
    x: windowWidth / 2,
    y: windowHeight / 2
};