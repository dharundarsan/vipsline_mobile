import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import PrimaryButton from "./PrimaryButton";
import colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import {useState} from "react";
import Divider from "./Divider";

const DropdownModal = (props) => {
    const [selectedValue, setSelectedValue] = useState();
    return <Modal transparent={true} animationType={"fade"} visible={props.isVisible} style={styles.dropdownModal}>
        <TouchableOpacity style={styles.modalContent} onPress={props.onCloseModal} activeOpacity={1} >
            <FlatList style={styles.dropdownList} data={props.dropdownItems}  renderItem={({item}) => {
                return <>
                    <PrimaryButton label={item} buttonStyle={styles.closeButton}
                                   pressableStyle={styles.closeButtonPressable}
                                   onPress={() => {
                                       props.onChangeValue(item);
                                   }}
                                   textStyle={[textTheme.bodyLarge, styles.closeButtonText, props.selectedValue === item ? {color: Colors.highlight, fontWeight: 500} : {}]}/>
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

export default DropdownModal;