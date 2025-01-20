import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import CustomSwitch from "../../ui/CustomSwitch";
import {AntDesign} from "@expo/vector-icons";
import {dateFormatter, formatDate} from "../../util/Helpers";
import AddStaffModal from "./addStaffModal";
import Toast from "../../ui/Toast";
import {useSelector} from "react-redux";

import { createSelector } from 'reselect';

const selectStaffById = createSelector(
    (state) => state.staff.staffs, // Input selector
    (_, id) => id, // Input selector for the ID
    (staffs, id) => staffs.find((staff) => staff.id === id) // Compute the result
);

export default function StaffProfile(props) {
    // const details = useSelector((state) => state.staff.staffs).find((staff) => staff.id === props.id);


    const details = useSelector((state) => selectStaffById(state, props.id));

    const [calenderBookingSwitch, setCalenderBookingSwitch] = useState(details.calendar_bookings);
    const [loginAccessSwitch, setLoginAccessSwitch] = useState(details.login_access);

    const [editStaffModalVisibility, setEditStaffModalVisibility] = useState(false);
    const toastRef = useRef(null);







    return <ScrollView
        style={styles.staffProfile}
        contentContainerStyle={{alignItems: "center"}}
        showsVerticalScrollIndicator={false}
    >
        <Toast
            ref={toastRef}
        />
        {
            editStaffModalVisibility &&
            <AddStaffModal
                isVisible={editStaffModalVisibility}
                onClose={() => setEditStaffModalVisibility(false)}
                toastRef={toastRef}
                edit
                data={details}
            />
        }
        <View style={styles.staffProfileCard}>
            <View style={styles.headingContainer}>
                <Text style={[textTheme.titleMedium]}>
                    Basic Info
                </Text>
                <PrimaryButton
                    label={"Edit"}
                    buttonStyle={styles.editButton}
                    textStyle={styles.editButtonText}
                    onPress={() => setEditStaffModalVisibility(true)}
                />
            </View>
            <View style={{gap: 18}}>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    First name
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    {details.name}
                </Text>
            </View>

            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Last name
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    Not Provided
                </Text>
            </View>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Email
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    {details.email === "" || details.email === null ? "Not provided" : details.email}
                </Text>
            </View>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Mobile
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    {details.mobile === "" ? "Not provided" : details.mobile}
                </Text>
            </View>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Staff title
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    {details.title === "" ? "Not provided" : details.title}
                </Text>
            </View>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Gender
                </Text>
                <Text style={[textTheme.bodyLarge, ]}>
                    {details.gender === "" ? "Not provided" : details.gender}
                </Text>
            </View>
            <View>

                <Text style={[textTheme.titleMedium]}>
                    Employment
                </Text>
            </View>
            <View>
                <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                    Start date
                </Text>
                <Text style={[textTheme.bodyLarge]}>
                    {(details.start_date, "short") === "" ? "Not Provided" : dateFormatter(details.start_date, 'short')}
                </Text>
            </View>
                <View>
                    <Text style={[textTheme.bodyLarge,{color: Colors.grey500}]}>
                        End Date
                    </Text>
                    <Text style={[textTheme.bodyLarge, ]}>
                        {details.termination_date === "" ? "Not Provided" : dateFormatter(details.termination_date, 'short')}
                    </Text>
                </View>
                <View>

                    <Text style={[textTheme.titleMedium]}>
                        Settings
                    </Text>
                </View>
                <View style={{gap: 18, marginTop: 18}}>
                    <View style={{ flexDirection: 'row', }}>
                        <CustomSwitch
                            isOn={calenderBookingSwitch}
                            display
                            color={Colors.highlight}
                        />
                        <View style={{ marginLeft: 18, flex: 1 }}>
                            <Text style={[textTheme.bodyLarge]} numberOfLines={1} ellipsizeMode="tail">
                                Allow calendar bookings
                            </Text>
                            <Text style={[textTheme.bodyMedium]}>
                                Allow this team member to receive bookings on the calendar
                            </Text>
                        </View>
                    </View>


                    <View style={{flexDirection: 'row'}}>
                        <CustomSwitch
                            isOn={loginAccessSwitch}
                            color={Colors.highlight}
                            display
                        />
                        <View style={{ marginLeft: 18, flex: 1 }}>
                            <Text style={[textTheme.bodyLarge]} numberOfLines={1} ellipsizeMode="tail">
                                Provide login access to this staff
                            </Text>
                            <Text style={[textTheme.bodyMedium]}>
                                The default user name and password will be
                                sent to staff’s email address
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.resendEmailButton}
                            >
                                <Text style={[textTheme.bodyMedium, styles.resendEmailButtonLabel]}>
                                    Resend email Invite
                                </Text>
                                <AntDesign name="arrowright" size={24} color={Colors.highlight} />
                            </TouchableOpacity>
                        </View>

                    </View>

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
        marginTop: 16
    },
    resendEmailButtonLabel: {
        color: Colors.highlight,

    },

})
