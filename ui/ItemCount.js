import {StyleSheet, Text, View} from "react-native";
import textTheme from "../constants/TextTheme";
import colors from "../constants/Colors";

export default function ItemCount(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.countText}>{props.count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.grey250,
        borderRadius: 8,
    },
    countText: {
        fontWeight: '600',
        paddingHorizontal: 6
    }
})