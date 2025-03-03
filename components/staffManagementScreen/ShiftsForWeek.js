import React, {useEffect, useRef, useState} from "react";
import {Text, View, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import { Checkbox, Divider } from "react-native-paper";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Table, Row } from "react-native-table-component";
import getRegularShiftsAPI from "../../apis/staffManagementAPIs/getRegularShiftsAPI";
import getDefaultStaffSchedulePatternAPI from "../../apis/staffManagementAPIs/getDefaultStaffSchedulePatternAPI";
import PrimaryButton from "../../ui/PrimaryButton";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import updateSchedulePatternAPI from "../../apis/staffManagementAPIs/updateSchedulePatternAPI";
import moment from "moment";
import AddAndUpdateShift from "./AddAndUpdateShift";
import createSchedulePatternAPI from "../../apis/staffManagementAPIs/createSchedulePatternAPI";

export default function ShiftsForWeek(props) {

    const changeTracker = {
        "Weekly": 1,
        "Every 2 weeks": 2,
        "Every 3 weeks": 3,
        "Every 4 weeks": 4,
    }

    const mappingWeekNames = {
        "Weekly": "WEEKLY",
        "Every 2 weeks": "EVERY_2_WEEKS",
        "Every 3 weeks": "EVERY_3_WEEKS",
        "Every 4 weeks": "EVERY_4_WEEKS"
    }


    const [schedule, setSchedule] = useState([]);
    const [selectedShifts, setSelectedShifts] = useState({});
    const [checkboxChecked, setCheckboxChecked] = useState({}); // Track checkbox state

    const [currentlySelectedShiftForAddAndUpdate, setCurrentlySelectedShiftForAddAndUpdate] = useState({
        shiftsWorkingList :[],
        name: "",
        week: 0,
        day: 0
    });


    const [addShiftVisibility, setAddShiftVisibility] = useState(false)
    const toastRef = useRef(null);

    const shifts = useSelector(state => state.staff.shiftTiming);

    const [loading, setLoading] = useState(false)

    // console.log(JSON.stringify(schedule, null, 2));


    useEffect(() => {



        parseSchedule(props.data);
    }, []);


    useEffect(() => {



        if(props.scheduleTypeChangeTracker === "" || props.scheduleTypeChangeTracker === 0) {
            return;
        }

        if (props.scheduleTypeChangeTracker < 0) {
            // Remove last N weeks based on the negative value
            setSchedule(prevSchedule => {
                if(props.scheduleType === "Weekly") {
                    return prevSchedule.slice(0, 1);
                }
                return prevSchedule.slice(0, changeTracker[props.scheduleType]);
            });
            return;
        }

        handleScheduleTypeChange().then((res) => {
            const mergedSchedules = mergeSchedules(schedule.map((item) => Object.values(item)[1]), Object.values(res.data.data[0].schedule_list))
            parseSchedule(transformScheduleData(mergedSchedules));
        })

    }, [props.scheduleType]);

    async function handleScheduleTypeChange() {
        const response = await getDefaultStaffSchedulePatternAPI(props.scheduleTypeChangeTracker);
        return response;
    }

    const mergeScheduleData = (scheduleData) => {
        const mergedData = {
            end_date: scheduleData.end_date,
            schedule_type: scheduleData.schedule_type,
            start_date: scheduleData.start_date,
            staff_schedule_id: scheduleData.staff_schedule_id,
            schedule_list: {}
        };
        scheduleData.schedule_list.forEach((week, index) => {
            const weekId = (index + 1).toString(); // Convert week index to string (1, 2, 3)
            mergedData.schedule_list[weekId] = week.map(day => ({
                week_id: weekId,
                Shifts: day.Shifts ? day.Shifts : "No Shift",
                pattern_exists: day.pattern_exists || false,
                day_of_week: day.day_of_week
            }));
        });

        return mergedData;
    };

    function transformScheduleData(inputData) {
        const result = {
            "end_date": "2025-02-20",
            "schedule_type": "EVERY_2_WEEKS",
            "schedule_list": {},
            "staff_schedule_id": 216,
            "start_date": "2025-01-23"
        };

        inputData.forEach((weekData, index) => {
            const weekKey = (index + 1).toString();
            result.schedule_list[weekKey] = weekData.map(day => {
                let shifts = day.Shifts;
                if (Array.isArray(shifts)) {
                    shifts = shifts.map(shift => ({
                        start_time: shift.start_time,
                        name: shift.name,
                        end_time: shift.end_time,
                        id: shift.id
                    }));
                }

                return {
                    week_id: weekKey,
                    Shifts: shifts,
                    pattern_exists: day.pattern_exists,
                    day_of_week: day.day_of_week
                };
            });
        });

        return result;
    }



    async function handleSave() {
        if (loading) return;
        setLoading(true);
        const payload = {
            business_id: await SecureStore.getItemAsync('businessId'),
            resource_id: props.currentDayWorkingData.resource_id,
            staff_schedule_id: props.create ? undefined : props.data.staff_schedule_id,
            start_date: moment(props.startDate).format("YYYY-MM-DD"),
            end_date: props.endDate !== null ? moment(props.endDate).format("YYYY-MM-DD") : 'never',
            schedule_type: mappingWeekNames[props.scheduleType],
            schedule_pattern: schedule.map(weekItem =>
                weekItem.days.map(day => ({
                    shift_ids: selectedShifts[`${weekItem.week}-${day.day_of_week}`] === "No Shift"
                        ? []
                        : selectedShifts[`${weekItem.week}-${day.day_of_week}`]?.map(name => {
                        const shift = shifts.find(item => item.name === name);
                        return shift ? shift.id : null; // Return shift.id if found, otherwise null
                    }).filter(id => id !== null) || [], // Remove null values if no match found
                    day_of_week: day.day_of_week,
                    week: weekItem.week
                }))
            ).flat()
        };

        // console.log(props.create)

        if(props.create) {
            const response =  createSchedulePatternAPI(payload).then((response) => {
                if(response.data.other_message === "") {
                    props.toastRef.current.show(response.data.message);
                    props.onClose();
                }
                else {
                    props.toastRefTop.current.show(response.data.message);
                }
            });
        }
        else {
            const response =  updateSchedulePatternAPI(payload).then((response) => {
                if(response.data.other_message === "") {
                    props.toastRef.current.show(response.data.message);
                    props.onClose();
                }
                else {
                    props.toastRefTop.current.show(response.data.message);
                }
            });
        }

        props.setOnUpdate(prev => !prev);





        setLoading(false);

    }


    function mergeSchedules(oldSchedule, newSchedules) {
        const maxWeek = oldSchedule.length > 0 ? oldSchedule.length : 0;

        newSchedules.forEach((weekData, index) => {
            const newWeekNumber = maxWeek + index + 1;

            oldSchedule.push(weekData.map(day => ({
                ...day,
                week_id: newWeekNumber
            })));
        });

        return oldSchedule;
    }



    const parseSchedule = (data) => {
        let formattedSchedule = [];
        let initialShifts = {};
        let initialCheckboxState = {};

        Object.entries(data.schedule_list).forEach(([week, days]) => {
            formattedSchedule.push({ week: parseInt(week), days });
            days.forEach(day => {
                initialShifts[`${week}-${day.day_of_week}`] =
                    Array.isArray(day.Shifts)
                        ? day.Shifts.map(s => s.name)
                        : day.Shifts === "No Shift"
                            ? "No Shift"
                            : [day.Shifts.name];
                initialCheckboxState[`${week}-${day.day_of_week}`] = day.Shifts !== 'No Shift'; // Set checkbox based on "No Shift"
            });
        });

        setSchedule(formattedSchedule);
        setSelectedShifts(initialShifts);
        setCheckboxChecked(initialCheckboxState);
    };


    const handleShiftChange = (week, day, shiftId, index) => {
        setSelectedShifts(prevState => {
            let updatedShifts = Array.isArray(prevState[`${week}-${day}`])
                ? [...prevState[`${week}-${day}`]]
                : [];

            if (typeof shiftId === "string") {
                shiftId = [shiftId]; // Ensure shiftId is an array
            }

            updatedShifts[index] = shiftId[0]; // Ensure only the correct shift name is updated

            return {
                ...prevState,
                [`${week}-${day}`]: updatedShifts
            };
        });
    };




    const handleCheckboxChange = (week, day) => {
        setCheckboxChecked(prevState => {
            const newState = { ...prevState, [`${week}-${day}`]: !prevState[`${week}-${day}`] };
            if (!newState[`${week}-${day}`]) {
                setSelectedShifts(prev => ({
                    ...prev,
                    [`${week}-${day}`]: "No Shift" // Reset selected shifts when unchecked
                }));
            }
            return newState;
        });
    };



    return (Object.values(props.data).length > 0 &&
        <View>
            {
                addShiftVisibility &&
                <AddAndUpdateShift
                    visible={addShiftVisibility}
                    onClose={() => setAddShiftVisibility(false)}
                    currentDayWorkingData={currentlySelectedShiftForAddAndUpdate}
                    toastRef={toastRef}
                    regularShifts={true}
                    onSave={(value, week, day) => {
                        const shifts = value.map(shift => shift.name)

                        setSelectedShifts(prevState => ({
                            ...prevState,
                            [`${week}-${day}`]: shifts
                        }))
                    }}
                    resourceId={props.currentDayWorkingData.resource_id}
                />
            }
            {schedule.map((weekItem, weekIndex) => (
                <View key={weekIndex} style={styles.weekContainer}>
                    <Text style={styles.weekTitle}>{"Week " + weekItem.week + " of " + schedule.length}</Text>
                    <Divider />

                    <View style={styles.scheduleTable}>
                        <ScrollView>
                            <Table style={styles.tableBorder}>
                                {/* Table Header */}
                                <Row
                                    data={["  Day", "  Select Shift"]}
                                    style={styles.tableHeader}
                                    textStyle={styles.tableText}
                                />
                                <Divider />

                                {/* Table Rows */}
                                {weekItem.days.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Row
                                            data={[
                                                <View style={{flexDirection: "row", gap: 8, alignItems: "center",}}>
                                                    <Checkbox
                                                        status={checkboxChecked[`${weekItem.week}-${item.day_of_week}`] ? "checked" : "unchecked"}
                                                        color={Colors.highlight}
                                                        onPress={() => handleCheckboxChange(weekItem.week, item.day_of_week)} // Toggle checkbox
                                                    />
                                                    <Text>{item.day_of_week}</Text>
                                                </View>
                                            ]}
                                            style={styles.tableCell}
                                            textStyle={styles.tableText}
                                        />

                                        <Row
                                            data={[
                                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 4}}>
                                                    {Array.isArray(selectedShifts[`${weekItem.week}-${item.day_of_week}`]) &&
                                                    selectedShifts[`${weekItem.week}-${item.day_of_week}`].length > 1
                                                        ? <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                            {selectedShifts[`${weekItem.week}-${item.day_of_week}`].map((shift, index) => (
                                                                <CustomTextInput
                                                                    key={index}
                                                                    type="dropdown"
                                                                    value={shift}
                                                                    dropdownItems={shifts.map(s => s.name)}
                                                                    onChangeValue={(shiftIds) => handleShiftChange(weekItem.week, item.day_of_week, shiftIds, index)}
                                                                    flex
                                                                    dropdownOnPress={checkboxChecked[`${weekItem.week}-${item.day_of_week}`]}
                                                                    labelEnabled={false}
                                                                    dropdownLabelTextStyle={{fontSize: 14}}
                                                                />
                                                            ))}
                                                        </View>
                                                        : (
                                                            <CustomTextInput
                                                                type="dropdown"
                                                                value={selectedShifts[`${weekItem.week}-${item.day_of_week}`] || []}
                                                                dropdownItems={shifts.map(s => s.name)}
                                                                onChangeValue={(shiftIds) => {

                                                                    handleShiftChange(weekItem.week, item.day_of_week, shiftIds, 0)
                                                                    setCurrentlySelectedShiftForAddAndUpdate(item.Shifts)
                                                                }}
                                                                flex
                                                                dropdownOnPress={checkboxChecked[`${weekItem.week}-${item.day_of_week}`]}
                                                                dropdownLabelTextStyle={{fontSize: 14}}

                                                            />
                                                        )}
                                                    <MaterialIcons
                                                        name="keyboard-arrow-right"
                                                        size={24}
                                                        color={Colors.highlight}
                                                        onPress={() => {
                                                            if(checkboxChecked[`${weekItem.week}-${item.day_of_week}`] && selectedShifts[`${weekItem.week}-${item.day_of_week}`] === "No Shift") {
                                                                setCurrentlySelectedShiftForAddAndUpdate(prev => ({
                                                                    ...prev,
                                                                    shiftsWorkingList: [],
                                                                    week: weekItem.week,
                                                                    day: item.day_of_week,
                                                                    name: "dfvb",
                                                                }))
                                                                setAddShiftVisibility(true);
                                                            }

                                                            if(checkboxChecked[`${weekItem.week}-${item.day_of_week}`] && selectedShifts[`${weekItem.week}-${item.day_of_week}`] !== "No Shift")  {
                                                                setCurrentlySelectedShiftForAddAndUpdate(prev => ({
                                                                    ...prev,
                                                                    shiftsWorkingList: selectedShifts[`${weekItem.week}-${item.day_of_week}`].map((item, index) => {
                                                                        return shifts.find((shift) => {
                                                                            if (shift.name === item) {
                                                                                return shift
                                                                            }
                                                                        })
                                                                    }),
                                                                    week: weekItem.week,
                                                                    day: item.day_of_week,
                                                                    name: "dfvb",
                                                                }))
                                                                setAddShiftVisibility(true);
                                                            }



                                                        }}
                                                    />
                                                </View>
                                            ]}
                                            style={styles.tableCell}
                                            textStyle={styles.tableText}
                                        />

                                    </View>
                                ))}
                            </Table>
                        </ScrollView>

                    </View>

                </View>
            ))}
            {
                loading ?
                    <PrimaryButton
                        label={"Save"}
                        buttonStyle={{marginBottom: 32}}
                    ><ActivityIndicator /></PrimaryButton> :
                <PrimaryButton
                    label={"Save"}
                    onPress={handleSave}
                    buttonStyle={{marginBottom: 32}}
                />
            }

        </View>
    );
}

const styles = StyleSheet.create({
    weekContainer: { marginVertical: 20 },
    weekTitle: { marginBottom: 10 },
    scheduleTable: {
        backgroundColor: 'white',
        marginBottom: 15,
    },
    tableBorder: {},
    tableHeader: {
        height: 40,
        // backgroundColor: '#f1f1f1',
    },
    tableText: {
        // textAlign: 'center',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    tableCell: {
        flex: 1,
        padding: 8,
    },
    button: { marginTop: 20 },
    dropdownContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    }
});
