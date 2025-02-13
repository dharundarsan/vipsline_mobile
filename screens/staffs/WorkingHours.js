import {Text, View, StyleSheet} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {AntDesign} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import CustomDropdown from "../../components/common/CustomDropdown";
import CustomSwiper from "../../components/common/CustomSwiper";
import Team from "../../components/staffManagementScreen/Team";
import Week from "../../components/staffManagementScreen/Week";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {getSchedulesForStaffByDatesAPI, updateIsFetching, updateSchedulesForStaff} from "../../store/staffSlice";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment/moment";
import {log} from "expo/build/devtools/logger";

export default function WorkingHours(props) {

    const dispatch = useDispatch();
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



    return <View style={{flex: 1}}>

        <CustomSwiper

            tabTextStyle={[textTheme.titleMedium, {color: Colors.black}]}
            tabContainerStyle={{backgroundColor: Colors.white}}

        >

            <Team
                tabLabel={"Teams"}
                staffs={staffs}
                date={date}
                setDate={setDate}
                loading={loading}
                setOnUpdate={setOnUpdate}
            />
            <Week tabLabel={"Week"}/>
        </CustomSwiper>



    </View>
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})