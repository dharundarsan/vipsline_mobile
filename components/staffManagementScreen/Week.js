import {Text, View, StyleSheet} from "react-native";

export default function Week(props) {
    return  <View style={styles.week}>
        <Text>
            Week
        </Text>
    </View>
}

const styles = StyleSheet.create({
    week: {
        flex: 1,
    }
})
