import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import CustomSwitch from "../../ui/CustomSwitch";
import {AntDesign} from "@expo/vector-icons";
import AssignServicesModal from "./AssignServicesModal";
import {useDispatch, useSelector} from "react-redux";
import {getAllServicesFromDb} from "../../store/staffSlice";
import Toast from "../../ui/Toast";
import {createSelector} from "reselect";
import PermissionsModal from "./PermissionsModal";

const selectStaffById = createSelector(
    (state) => state.staff.staffs, // Input selector
    (_, id) => id, // Input selector for the ID
    (staffs, id) => staffs.find((staff) => staff.id === id) // Compute the result
);


export default function Workspace(props) {

    const [calenderBookingSwitch, setCalenderBookingSwitch] = useState(false);
    const [loginAccessSwitch, setLoginAccessSwitch] = useState(false);

    const [assignServicesModalVisibility, setAssignServicesModalVisibility] = useState(false);
    const [permissionsModalVisibility, setPermissionsModalVisibility] = useState(false)

    const details = useSelector((state) => selectStaffById(state, props.id));

    const dispatch = useDispatch();
    const toastRef = useRef(null);

    // console.log(JSON.stringify(details, null, 2));


    return <ScrollView
        style={styles.staffProfile}
        contentContainerStyle={{alignItems: "center"}}
    >
        <Toast ref={toastRef}/>
        {
            assignServicesModalVisibility &&
            <AssignServicesModal
                visible={assignServicesModalVisibility}
                onClose={() => setAssignServicesModalVisibility(false)}
                staffName={props.staffName}
                id={props.id}
                toastRef={toastRef}
            />
        }
        {
            permissionsModalVisibility &&
            <PermissionsModal
                visible={permissionsModalVisibility}
                onClose={() => setPermissionsModalVisibility(false)}
                staffName={props.staffName}
                resourceId={props.id}
                toastRef={toastRef}
            />
        }

        <View style={styles.staffProfileCard}>
            <View style={styles.headingContainer}>
                <Text style={[textTheme.titleMedium]}>
                    Services
                </Text>
                <PrimaryButton
                    label={"Edit"}
                    buttonStyle={styles.editButton}
                    textStyle={styles.editButtonText}
                    onPress={() => {
                        dispatch(getAllServicesFromDb(props.id));
                        setAssignServicesModalVisibility(true)
                    }}
                />
            </View>
            <View>
                <View>
                    <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                        Provider
                    </Text>
                    <Text style={[textTheme.bodyLarge, {marginTop: 4}]}>
                        No services
                    </Text>
                </View>
                <View style={[styles.headingContainer, {marginTop: 18}]}>
                    <Text style={[textTheme.titleMedium]}>
                        Permissions
                    </Text>
                    {
                        details.login_access ?
                        <PrimaryButton
                            label={"Edit"}
                            buttonStyle={styles.editButton}
                            textStyle={styles.editButtonText}
                            onPress={() => setPermissionsModalVisibility(true)}
                        /> : <></>
                    }
                </View>
                <View>
                    <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                        Access control
                    </Text>
                    <Text style={[textTheme.bodyLarge, {marginTop: 4}]}>
                        {details.login_access ? "Enabled" : "Disabled"}
                    </Text>
                </View>

            </View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    staffProfile: {
        flex: 1,
        backgroundColor: Colors.grey150
    },
    staffProfileCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.grey200,
        marginVertical: 16,
        width: "95%",
        backgroundColor: "white",
        borderRadius: 6,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    headingContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: Colors.white
    },
    editButtonText: {
        color: Colors.highlight
    },
    resendEmailButton: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginTop: 8
    },
    resendEmailButtonLabel: {
        color: Colors.highlight,

    },

})
