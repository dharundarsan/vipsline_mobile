import {View, StyleSheet, Text, Image} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";

export default function AnalyticsCountCard(props) {
    return (
        <View style={[styles.card, {

        }]}>
            <View style={styles.content}>
                <Text style={[textTheme.titleMedium, styles.count]}>{props.count}</Text>
                <Text style={[textTheme.bodyMedium, styles.text]}>{props.text}</Text>
            </View>
            {
                props.source === undefined ? <View></View> : <View>
                    <Image source={props.source} style={styles.image} />
                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        flexDirection: "row",
        borderRadius: 8,
        borderColor: Colors.grey400,
        paddingHorizontal: 12,
        paddingVertical: 32,
        justifyContent: 'space-between',
        gap: 8,
        width: '42%',

    },
    image: {
        width: 30,
        height: 30,

    },
    count: {
        fontSize: 20,
        letterSpacing: 0,
    },
    text: {
        color: Colors.grey600,
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 16,

    },
    content: {
        paddingLeft: 8,
        gap: 8
    }
})