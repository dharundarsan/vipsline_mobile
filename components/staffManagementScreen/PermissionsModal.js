import Toast from "../../ui/Toast";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteTimeOffRequestAPI from "../../apis/staffManagementAPIs/deleteTimeOffRequestAPI";
import {FlatList, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Divider} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomSwitch from "../../ui/CustomSwitch";
import getAllowedPagesForStaffAPI from "../../apis/staffManagementAPIs/getAllowedPagesForStaffAPI";
import grandAccessToPagesForStaffAPI from "../../apis/staffManagementAPIs/grandAccessToPagesForStaffAPI";

export default function PermissionsModal(props) {

    const toastRef = useRef(null);
    const [permissionEnabledIndexes, setPermissionEnabledIndexes] = useState([]);

    useEffect(() => {
        async function fetchPermissions() {
            const response = await getAllowedPagesForStaffAPI(props.resourceId);
            const permissions = response.data.data;
            setPermissionEnabledIndexes(permissions);
        }
        fetchPermissions()
    }, []);

    async function onSave() {
        const permissionAllowedIndices = permissionEnabledIndexes.filter((item) => item.pageExists).map((item) => item.id);
        const response = await grandAccessToPagesForStaffAPI(props.resourceId, permissionAllowedIndices);

        if(response.data.other_message === "") {
            props.toastRef.current.show(response.data.message)
            props.onClose();
        }
        else {
            toastRef.current.show(response.data.other_message);
        }

    }
    function renderItem({item, index}) {
        return <>
            <View style={styles.permissionList}>
                <Text style={[textTheme.bodyLarge, {paddingLeft: 24}]}>
                    {item.name}
                </Text>
                <View style={{flexDirection: "row", gap: 16, width: "38%"}}>
                    <CustomSwitch
                        color={Colors.highlight}
                        onToggle={() => {
                            setPermissionEnabledIndexes((prevPages) =>
                                prevPages.map((page) =>
                                    page.id === index + 1 ? { ...page, pageExists: !page.pageExists } : page
                                )
                            );
                        }}
                        isOn={item.pageExists}/>
                    <Text style={[textTheme.bodyLarge, {}]}>{item.pageExists ? "Enabled" : "Disabled"}</Text>
                </View>

            </View>
            <Divider />
        </>
    }


    return <Modal
        visible={props.visible}
        animationType={"slide"}
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>

        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{props.staffName}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.labelContainer}>
                <Text style={[textTheme.titleMedium]}>Permissions</Text>
                <Text style={[textTheme.bodyMedium, {marginTop: 6}]}>Enable or disable staff access</Text>
            </View>

            <View style={styles.headerContainer}>
                <Text style={[textTheme.titleMedium]}>Features</Text>
                <Text style={[textTheme.titleMedium]}>Enable / Disable</Text>
            </View>
            <Divider/>
            <FlatList
                data={permissionEnabledIndexes}
                renderItem={renderItem}
                scrollEnabled={false}
            />



        </ScrollView>

        <View style={styles.bottomContainer}>
            <PrimaryButton
                label={props.edit ? "Update" : "Save"}
                buttonStyle={styles.saveButton}
                onPress={onSave}
            />
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
    titleText: {
        fontWeight: "500",
        flex: 1,
        paddingLeft: 8,
        textAlign: "center",
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        marginVertical: 16
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginTop: 32,
        marginBottom: 8
    },
    labelContainer: {
        paddingHorizontal: 12
    },
    permissionList: {
        flexDirection: "row",
        // borderWidth: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,

    },
    bottomContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 18,
        marginBottom: 6
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey500,
    },
    cancelButtonText: {
        color: Colors.black,
    },
    saveButton: {
        flex: 1,
    }
})