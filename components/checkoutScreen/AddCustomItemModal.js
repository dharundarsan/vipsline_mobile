import {Modal, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useState} from "react";
import Colors from "../../constants/Colors";
import {formatDate} from "../../util/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";

const AddCustomItemModal = (props) => {
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const dispatch = useDispatch();

    return <Modal visible={props.isVisible} onCancel={props.onCloseModal} animationType={"slide"}>
        <View style={styles.headingAndCloseContainer}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Add Custom Item</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <Text style={[textTheme.labelLarge]}>Custom Item Name</Text>
            <View style={[styles.inputContainer, styles.nameInputContainer]}>
                <TextInput style={[textTheme.bodyLarge, styles.inputText]} value={itemName}
                           onChangeText={(name) => setItemName(name)}/>
            </View>
            <Text style={[textTheme.labelLarge]}>Price</Text>
            <View style={styles.inputContainer}>
                <FontAwesome style={styles.rupeeSymbol} name="rupee" size={20} color={Colors.grey600}/>
                <TextInput style={[textTheme.bodyLarge, styles.inputText]} keyboardType={"number-pad"}
                           onChangeText={(price) => setItemPrice(price)} value={itemPrice.toString()}/>
            </View>
        </View>
        <View style={styles.addToCartButtonContainer}>
            <PrimaryButton onPress={() => {
                props.onCloseModal();
                dispatch(addItemToCart({name: itemName, price: itemPrice}));
            }} label={"Add to cart"}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    addCustomItemModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    heading: {
        fontWeight: 500
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: Colors.background,
    },
    modalContent: {
        flex: 1,
        padding: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 5,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    nameInputContainer: {
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    rupeeSymbol: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 15,
        borderRightWidth: 1,
        borderRightColor: Colors.grey400,
    },
    inputText: {
        fontWeight: "500",
        flex: 1,
    },
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 30,
    }
})

export default AddCustomItemModal;