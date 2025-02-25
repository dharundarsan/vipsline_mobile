import {Pressable, Text, View} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import {Entypo} from "@expo/vector-icons";
import moment from "moment";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import React, {useState} from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {checkNullUndefined} from "../../util/Helpers";


const AppointmentsDatePicker = (props) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const rangeSelector = {
        "day": [
            "Past",
            "Today",
            "Upcoming"
        ],
        "week": [
            "Past Week",
            "This Week",
            "Upcoming Week",
        ],
        "month": [
            "Past Month",
            "This Month",
            "Upcoming Month",
        ],
        "year": [
            "Past Year",
            "This Year",
            "Upcoming Year",
        ]
    }

    moment.updateLocale('en', {
        week: {
            dow: 0, // Sunday is the first day of the week
        },
    });

    return <View style={[{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    }, props.containerStyle]}>
        {isDatePickerVisible &&
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={props.maximumDate}
                minimumDate={props.minimumDate}
                date={props.date} // Initial date
                onConfirm={(selectedDate) => {
                    setIsDatePickerVisible(false)
                    props.handleConfirm(selectedDate)
                }}
                onCancel={() => {
                    setIsDatePickerVisible(false)
                }}
                themeVariant="light"
                style={props.dateStyle}
            />
        }

        <PrimaryButton
            onPress={() => {
                const currentDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate());
                const minimumDate = props.minimumDate
                    ? new Date(props.minimumDate.getFullYear(), props.minimumDate.getMonth(), props.minimumDate.getDate())
                    : null;

                if (!minimumDate || currentDate > minimumDate) {
                    props.onLeftArrowPress();
                }
            }}
            buttonStyle={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.grey300,
                borderTopLeftRadius: 1000,
                borderBottomLeftRadius: 1000,
            }}>
            <Entypo name="chevron-left" size={24} color="black"/>
        </PrimaryButton>
        <View style={{
            flex: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderColor: Colors.grey300,
            height: "100%",
        }}>
            <Text style={[{
                textAlignVertical: "center",
                flex: 1,
                backgroundColor: "#E7E8FF",
                width: "100%",
                textAlign: "center",
            }, textTheme.bodyLarge]}>
                {
                    new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate())
                    < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                        ? rangeSelector[props.range][0] // past
                        : new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate())
                        > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                            ? rangeSelector[props.range][2] // present
                            : rangeSelector[props.range][1]  //   future
                }
            </Text>

        </View>
        <Pressable
            onPress={() => {
                if (props.type === undefined || props.type === "display") {
                    return null
                } else {
                    setIsDatePickerVisible(true);
                }
            }}
            android_ripple={{color: Colors.ripple}}
            style={{
                flex: 1.5,
                backgroundColor: "white",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: Colors.grey300,
                alignItems: "center",
            }}>
            <Text style={[{
                textAlignVertical: "center",
                flex: 1
            }, textTheme.bodyLarge]}>{
                props.displayText ? props.displayText :
                    props.range === "day" ?
                        moment(props.date).format("DD MMM, YYYY") :
                        props.range === "week" ?
                            moment(props.date).startOf('week').format('DD') + " - " + moment(props.date).endOf("week").format("DD MMM, YYYY") :
                            props.range === "month" ? moment(props.date).format("MMM YYYY") : moment(props.date).format("DD MMM, YYYY") // right now ui is not clear for me
            }</Text>
        </Pressable>

        <PrimaryButton
            onPress={() => {
                const currentDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate());
                const maximumDate = props.maximumDate
                    ? new Date(props.maximumDate.getFullYear(), props.maximumDate.getMonth(), props.maximumDate.getDate())
                    : null;

                if (!maximumDate || currentDate < maximumDate) {
                    props.onRightArrowPress();
                }
            }}
            buttonStyle={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.grey300,
                borderTopRightRadius: 1000,
                borderBottomRightRadius: 1000,
            }}>
            <Entypo name="chevron-right" size={24} color="black"/>
        </PrimaryButton>
    </View>
}

export default AppointmentsDatePicker