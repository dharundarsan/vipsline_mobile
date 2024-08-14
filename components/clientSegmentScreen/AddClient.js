import PrimaryButton from "../../ui/PrimaryButton";
import {Text, View, StyleSheet} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Colors from "../../constants/Colors";
import React, {useState} from "react";
import CreateClientModal from "../checkoutScreen/CreateClientModal";
import {loadClientsFromDb} from "../../store/clientSlice";
import {useDispatch} from "react-redux";

export default function AddClient() {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    return(
        <View style={styles.addClientContainer}>
            <CreateClientModal
                isVisible={isModalVisible}
                onCloseModal={() => {
                    setIsModalVisible(false);
                    dispatch(loadClientsFromDb());
                }}

            />
            <PrimaryButton
                buttonStyle={styles.addClientButton}
                onPress={() => {
                    setIsModalVisible(true);
                }}
            >
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.addTextContainer}>
                        <Text style={styles.addText}>Add </Text>
                    </View>
                    <View style={styles.addSymbolContainer}>
                        <FontAwesome6 name="add" size={14} color={Colors.darkBlue}/>
                    </View>
                </View>
            </PrimaryButton>
        </View>
    );
}

const styles = StyleSheet.create({
    addClientContainer: {
        alignItems: 'flex-end',
    },
    addClientButton: {
        width: '25%',
        height: 38,
        margin: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.highlight,
    },
    addTextContainer: {
        width: 28,
        height: 18
    },
    addText: {
        fontSize: 13,
        fontWeight: '700',
        includeFontPadding: false,
        paddingTop: 2
    },
    addSymbolContainer: {
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center"
    },
})