import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRef, useState} from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import CreateClientModal from "../checkoutScreen/CreateClientModal";
import {loadClientInfoFromDb} from "../../store/clientInfoSlice";
import {useDispatch} from "react-redux";


const MoreOptionDropDownModal = (props) => {
    const textRef = useRef(null);

    return <Modal transparent={true} animationType={"fade"} visible={props.isVisible} style={styles.dropdownModal}>
        <TouchableOpacity style={styles.modalContent} onPress={props.onCloseModal} activeOpacity={1} >
            <FlatList style={styles.dropdownList} data={props.dropdownItems}  renderItem={({item}) => {
                return <>
                    <PrimaryButton buttonStyle={styles.closeButton}
                                   pressableStyle={styles.closeButtonPressable}
                                   onPress={() => {
                                       if(item === "Edit client") {
                                            props.setOption("editClient");
                                       }
                                       else {
                                            props.setOption("deleteClient");
                                       }
                                   }}
                                   >
                        <Text style={[textTheme.bodyLarge, item === "Delete client" ? {color: Colors.error} : {}]}>{item}</Text>
                    </PrimaryButton>
                    <Divider/>
                </>

            }}/>
            <PrimaryButton label={"Close"} onPress={props.onCloseModal} buttonStyle={styles.closeButton}
                           textStyle={[textTheme.bodyLarge, styles.closeButtonText]}/>
        </TouchableOpacity>
    </Modal>
}

const styles = StyleSheet.create({
    dropdownModal: {
        flex: 1,
        height: "100%",
    },
    closeButton: {
        backgroundColor: Colors.background,
    },
    closeButtonPressable: {
        paddingVertical: 15,
    },
    closeButtonText: {
        color: Colors.black
    },
    modalContent: {
        gap: 10,
        padding: 10,
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: Colors.ripple
    },
    dropdownList: {
        backgroundColor: Colors.white,
        flexGrow: 0,
        borderRadius: 5,
    }
})

export default MoreOptionDropDownModal;