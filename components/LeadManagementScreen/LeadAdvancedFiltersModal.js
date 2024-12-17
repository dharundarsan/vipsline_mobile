import {Modal, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import React from "react";
import Colors from "../../constants/Colors";
import deleteLeadAPI from "../../util/apis/deleteLeadAPI";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";
import {updateNavigationState} from "../../store/NavigationSlice";

const LeadAdvancedFiltersModal = (props) => {
    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"slide"}>
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>Lead Filters</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={{flex: 1}}>

        </View>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={async () => {

            }}
                           buttonStyle={{backgroundColor: "white", borderWidth: 1, borderColor: Colors.grey400}}
                           pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>
            </PrimaryButton>
            <PrimaryButton onPress={() => {
            }} label="Save" buttonStyle={{flex: 1}}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    saveButtonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.grey300,
        flexDirection: "row",
        gap: 12,
    }
})

export default LeadAdvancedFiltersModal;