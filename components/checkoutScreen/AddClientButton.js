import PrimaryButton from "../../ui/PrimaryButton";
import {StyleSheet, Text, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {useSelector} from "react-redux";

const AddClientButton = (props) => {
    const clientInfo = useSelector(state => state.clientInfo);


    return <PrimaryButton buttonStyle={styles.addClientButton} onPress={props.onPress}>
        <View style={styles.addClientButtonInnerContainer}>
            <FontAwesome6 name="plus-square" size={25} color={Colors.highlight}/>
            <Text
                style={[TextTheme.titleMedium, styles.addClientButtonText]}>{clientInfo.isClientSelected ? clientInfo.details.name : "Add Client"}</Text>
        </View>
    </PrimaryButton>
};

const styles = StyleSheet.create({
    addClientButton: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.highlight,
        borderWidth: 2,
        margin: 20,
        borderRadius: 10,
    },
    addClientButtonInnerContainer: {
        gap: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    addClientButtonText: {
        color: Colors.highlight,
    }
});

export default AddClientButton;