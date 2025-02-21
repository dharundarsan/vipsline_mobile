import {Text, View, StyleSheet, Animated, FlatList, ScrollView} from "react-native";
import AppointmentsDatePicker from "../appointments/AppointmentsDatePicker";
import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import CustomDropdown from "../common/CustomDropdown";
import StaffCard from "./StaffCard";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {useDispatch, useSelector} from "react-redux";
import {capitalizeFirstLetter, capitalizeFirstLetters, checkNullUndefined} from "../../util/Helpers";
import SlantingLines from "../../ui/SlantingLines";
import Toast from "../../ui/Toast";
import {
    clearSchedulesForStaff,
    getSchedulesForStaffByDatesAPI,
    loadShiftTiming,
    loadTimeOffTypeFromDb, updateIsFetching, updateSchedulesForStaff
} from "../../store/staffSlice";
import {Bullets} from "react-native-easy-content-loader";
import DropdownModal from "../../ui/DropdownModal";
import textTheme from "../../constants/TextTheme";
import AddAndUpdateShift from "./AddAndUpdateShift";
import AddAndUpdateTimeOffForStaff from "./AddAndUpdateTimeOffForStaff";
import RegularShifts from "./RegularShifts";
export default function Team() {

    moment.updateLocale('en', {
        week: {
            dow: 0, // Sunday is the first day of the week
        },
    });
    const dataNew = useSelector(state => state.staff.schedulesForStaff);
    const toastRef = useRef(null);
    const dispatch = useDispatch();
    const isFetching = useSelector(state => state.staff.isFetching);

    const [bottomModalVisibility, setBottomModalVisibility] = useState(false);
    const [currentDayWorkingData, setCurrentDayWorkingData] = useState({});

    const [addShiftVisibility, setAddShiftVisibility] = useState(false)
    const [addStaffTimeOffVisibility, setAddStaffTimeOffVisibility] = useState(false);
    const [timeOffTypeEdit, setTimeOffTypeEdit] = useState(false);
    const [regularShiftsVisibility, setRegularShiftsVisibility] = useState(false);


    const [date, setDate] = useState(moment());
    const [loading, setLoading] = useState(false)
    const [onUpdate, setOnUpdate] = useState(true);


    const staffs = useSelector(state => state.staff.staffs);
    useEffect(() => {
        async function f() {
            for(let staff_index = 0; staff_index < staffs.length; staff_index++) {

                dispatch(
                    getSchedulesForStaffByDatesAPI(staffs[staff_index].id,
                        moment(date).startOf('week').format('YYYY-MM-DD'),
                        moment(date).endOf("week").format("YYYY-MM-DD"),
                        staff_index
                    )
                ).then((response) => {
                    let staff_name = staffs.find((staff) => staff.id === staffs[staff_index].id);
                    Object.assign(response, {staff_index: staff_index});
                    dispatch(updateSchedulesForStaff({[staff_name.name]: response}));
                })
            }
        }


        f().then(() => {
            dispatch(updateIsFetching(false));
        });

    }, [date, onUpdate]);


    const [edit, setEdit] = useState()


    function renderItem(dataItem) {
        return <PrimaryButton
        buttonStyle={styles.button}
        pressableStyle={styles.pressable}
        rippleColor={Colors.ripple}
        onPress={() => {
            if(dataItem.item.businessHoliday) {
                return
            }
            if(dataItem.item.timeOffRequestId > -1) {
                setTimeOffTypeEdit(true)
            }
            else {
                setTimeOffTypeEdit(false)
            }
            setBottomModalVisibility(true)
            setCurrentDayWorkingData(dataItem.item);
            dispatch(loadShiftTiming());
        }}
        >

            <View>
                <Text style={[textTheme.titleSmall]}>
                    {new Intl.DateTimeFormat("en-US", { weekday: "short", day: "2-digit", month: "short" }).format(moment(dataItem.item.date).toDate())}
                </Text>
            </View>
            <View style={{gap: 8}}>

                {
                    dataItem.item.businessHoliday ?
                        <View style={[styles.timeDurationCard, {backgroundColor: Colors.white, position: 'relative', overflow:"scroll"}]}>
                        {/*<SlantingLines />*/}
                            <Text style={[textTheme.bodySmall]}>{"Holiday"}</Text>
                        </View> :
                        dataItem.item.permission ?
                            <View style={[styles.timeDurationCard, {backgroundColor: Colors.grey150}]}>
                                <Text style={[textTheme.bodyMedium, {textAlign: "center"}]}>{`Permission\n${dataItem.item.permissionStartTime} - ${dataItem.item.permissionEndTime}`}</Text>
                            </View> :
                            dataItem.item.timeOff ?
                                <View style={[styles.timeDurationCard, {backgroundColor: Colors.grey150}]}>
                                    <Text style={[textTheme.bodyMedium, {textAlign: "center"}]}>{"Leave"}</Text>

                                    </View> : dataItem.item.shiftsWorkingList.length === 0 &&  dataItem.item.timeOffRequestId === -1?
                                    <View style={[styles.timeDurationCard]}>
                                        <Text style={[textTheme.bodyMedium]}>No Shift</Text>
                                    </View> :
                                    dataItem.item.shiftsWorkingList.map((innerItem, index) => {
                                        return <View style={styles.timeDurationCard} key={index}>
                                            <Text>{innerItem.start_time + " - " + (innerItem.end_time)}</Text>
                                        </View>
                                    })
                }
                {

                }
            </View>
        </PrimaryButton>
    }



    return  <View style={styles.team}>
        <Toast ref={toastRef}/>
        <DropdownModal
            isVisible={bottomModalVisibility}
            onCloseModal={() => {
                setBottomModalVisibility(false)
            }}
            dropdownItems={[
                "Add shift",
                "Set Regular shifts",
                "Add Time off"
            ]}
            iconImage={[
                require("../../assets/icons/staffIcons/plus.png"),
                require("../../assets/icons/staffIcons/time.png"),
                require("../../assets/icons/staffIcons/calender.png"),
            ]}
            imageHeight={24}
            imageWidth={24}
            primaryViewChildrenStyle={styles.dropdownInnerContainer}
            onChangeValue={(value) => {
                if (value === "Add shift") {
                    setAddShiftVisibility(true)
                } else if (value === "Set Regular shifts") {
                    setRegularShiftsVisibility(true);
                } else if (value === "Add Time off") {
                    setAddStaffTimeOffVisibility(true);
                    dispatch(loadTimeOffTypeFromDb());
                }
            }}
        >
            <View style={styles.bottomStaffProfileContainer}>
                <StaffCard
                    name={"dharun"}
                    pointerEvents={"none"}
                    staffCard={{borderWidth: 0, width: "100%"}}
                    staffCardPressable={{flexDirection: "Column"}}
                    nameShown={false}

                >
                    <View style={{width:'100%'}}>
                        <Text style={[textTheme.titleSmall, {textAlign: "center"}]}>
                            {Object.keys(currentDayWorkingData).length === 0 ? "" : capitalizeFirstLetters(currentDayWorkingData.name)}
                        </Text>
                        <Text style={[textTheme.bodySmall, {textAlign: "center"}]}>
                            {moment(currentDayWorkingData.date).toDate().toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short'
                            })}
                        </Text>
                    </View>
                </StaffCard>
            </View>
        </DropdownModal>
        {
            addShiftVisibility &&
            <AddAndUpdateShift
                visible={addShiftVisibility}
                onClose={() => setAddShiftVisibility(false)}
                currentDayWorkingData={currentDayWorkingData}
                toastRef={toastRef}
                setOnUpdate={setOnUpdate}
                startDate={moment(date).startOf('week').format('YYYY-MM-DD')}
                endDate={moment(date).endOf('week').format('YYYY-MM-DD')}
            />
        }
        {
            addStaffTimeOffVisibility &&
            <AddAndUpdateTimeOffForStaff
                visible={addStaffTimeOffVisibility}
                onClose={() => setAddStaffTimeOffVisibility(false)}
                edit={timeOffTypeEdit}
                currentDayWorkingData={currentDayWorkingData}
                toastRef={toastRef}
                setOnUpdate={setOnUpdate}

            />
        }
        {
            regularShiftsVisibility &&
            <RegularShifts
                currentDayWorkingData={currentDayWorkingData}
                visible={regularShiftsVisibility}
                onClose={() => setRegularShiftsVisibility(false)}
                toastRef={toastRef}

            />
        }

        <AppointmentsDatePicker
            date={date.toDate()}
            onRightArrowPress={() => {
                if(isFetching) {
                    toastRef.current.show("Fetching Please wait...");
                }
                else {
                    dispatch(clearSchedulesForStaff())
                    setDate(date.clone().add(1, "week")); // Correct argument order
                }
            }}
            onLeftArrowPress={() => {
                if(isFetching) {
                    toastRef.current.show("Fetching Please wait...");
                }
                else {
                    dispatch(clearSchedulesForStaff())
                    setDate(date.clone().subtract(1, "week")); // Correct argument order
                }
            }}
            type={"display"}
            range={"week"}
            containerStyle={{marginTop: 32, marginHorizontal: 8}}


        />

        <ScrollView>

            {

            dataNew.length >= staffs.length ?

        <FlatList
            data={dataNew.filter(item => item)}
            renderItem={({item}) => {
                return <CustomDropdown
                    renderItem={renderItem}
                    data={checkNullUndefined(Object.values(item)[0].staffScheduleResponseList) ? Object.values(item)[0].staffScheduleResponseList : []}
                    dropdownLabelCard={
                        <StaffCard
                            name={`${capitalizeFirstLetters(Object.keys(item)[0])}\n${Object.values(item)[0].total_working_hours}`}
                            pointerEvents={"none"}
                            staffCard={{ width: "100%", borderWidth: 0 }}
                            nameShown={false}

                        >
                            <View>
                                <Text style={[textTheme.titleSmall]}>
                                    {capitalizeFirstLetters(Object.keys(item)[0])}
                                </Text>
                                <Text style={[textTheme.bodySmall]}>
                                    {Object.values(item)[0].total_working_hours}
                                </Text>
                            </View>
                            </StaffCard>
                    }
                    arrowIcon={<MaterialIcons name="keyboard-arrow-down" size={24} color="black" />}
                    dropdownStyle={styles.dropdown}
                    labelButtonStyle={styles.labelButtonStyle}
                />

            }}
            scrollEnabled={false}
            style={{marginTop: 8}}


        /> : <Bullets
                    tHeight={35}
                    tWidth={"75%"}
                    listSize={staffs.length}
                    aSize={35}
                    animationDuration={500}
                    containerStyles={{
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.grey250
                    }}
                    avatarStyles={{ marginLeft: 16 }}
                />
            }
        </ScrollView>


    </View>
}

const styles = StyleSheet.create({
    team: {
        flex: 1,
        backgroundColor: "white",
    },
    dropdown: {
    },
    pressable: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    button: {
        backgroundColor: Colors.white
    },
    timeDurationCard: {
        borderWidth: 1,
        borderColor: Colors.grey600,
        borderRadius: 6,
        backgroundColor: Colors.highlight80,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    labelButtonStyle: {
        borderWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.grey300
    },
    dropdownInnerContainer: {
    flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 8
    },
    bottomStaffProfileContainer: {
        alignItems: "center",
        backgroundColor: Colors.white,

    }
})
