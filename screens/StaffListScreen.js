import {Text, View, StyleSheet} from "react-native";

export default function StaffListScreen() {
    return <View styles={styles.staffListScreen}>
        <Text>
            Staff List Screen
        </Text>
    </View>
}

const styles = StyleSheet.create({
    staffListScreen: {
        flex: 1,

    }
})