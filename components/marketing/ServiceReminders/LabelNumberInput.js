import { useState } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import Colors from "../../../constants/Colors";
import textTheme from "../../../constants/TextTheme";

export default function LabelNumberInput({ reminder_no, days, updateReminder }) {
    const [inputValue, setInputValue] = useState(days === 0 ? "" : days.toString());

    const handleChange = (text) => {
        const value = text.replace(/[^0-9]/g, ""); // Allow only numbers
        setInputValue(value);
        updateReminder(reminder_no, parseInt(value) || 0);
    };

    return (
        <View style={styles.container}>
            <TextInput
                keyboardType="number-pad"
                style={styles.input}
                value={inputValue}
                onChangeText={handleChange}
            />
            <View style={styles.labelContainer}>
                <Text style={[textTheme.bodyMedium, { flex: 1 }]}>days</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.grey400,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    labelContainer: {
        backgroundColor: Colors.grey150,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderLeftWidth: 1,
        borderLeftColor: Colors.grey400,
    },
});
