import PrimaryButton from "../../ui/PrimaryButton";
import {StyleSheet, Text, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {useSelector} from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const AddClientButton = (props) => {
    const clientInfo = useSelector(state => state.clientInfo);


    return <PrimaryButton buttonStyle={styles.addClientButton} onPress={props.onPress}>
        <View style={styles.addClientButtonInnerContainer}>
            <FontAwesome name="plus-square-o" size={24} color={Colors.highlight}/>
            <Text
                style={[TextTheme.bodyLarge, styles.addClientButtonText]}>{clientInfo.isClientSelected ? clientInfo.details.name : "Add Client"}</Text>
        </View>
    </PrimaryButton>
};

const styles = StyleSheet.create({
    addClientButton: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.highlight,
        borderWidth: 1.5,
        marginVertical:15,
        marginHorizontal: "auto",
        width:'85%',
    },
    addClientButtonInnerContainer: {
        gap: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
    },
    addClientButtonText: {
        color: Colors.highlight,
    }
});

export default AddClientButton;