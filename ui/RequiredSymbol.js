import {Text} from "react-native";
import Colors from "../constants/Colors";

export default function RequiredSymbol() {
    return <Text style={{color: Colors.error}}>*</Text>
}