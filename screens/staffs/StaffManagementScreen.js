import {Text, View, StyleSheet, FlatList, Image} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import {capitalizeFirstLetter, capitalizeFirstLetters} from "../../util/Helpers";
import {MaterialIcons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {Divider} from "react-native-paper";
import staffListIcon from "../../assets/icons/staffIcons/staff_list.png";
import shiftTimingIcon from "../../assets/icons/staffIcons/shift_timing.png";
import workingHoursIcon from "../../assets/icons/staffIcons/working_hours.png";
import commissionProfileIcon from "../../assets/icons/staffIcons/commission_profile.png";
import staffCommissionIcon from "../../assets/icons/staffIcons/staff_commission.png";
import businessClosedDates from "../../assets/icons/staffIcons/business_closed_dates.png";
import staffOffTypeIcon from "../../assets/icons/staffIcons/staff_off_type.png";
import {useLocationContext} from "../../context/LocationContext";
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useEffect} from "react";
import {updateNavigationState} from "../../store/NavigationSlice";
import {useDispatch} from "react-redux";

export default function StaffManagementScreen({navigation}) {

    const dispatch = useDispatch();

    // const { getLocation } = useLocationContext()
    // useFocusEffect(useCallback(() => {
    //     getLocation("Staff Management");
    // }, []))

    // useEffect(() => {
    //     dispatch(updateNavigationState("Staff Management"));
    // }, []);

    useFocusEffect(useCallback(() => {
        setTimeout(() => {
            dispatch(updateNavigationState("Staff Management"));

        }, 100)

    }, []))

    const staffCategories = [
        {
            label: "Staff list",
            icon: staffListIcon,
        },
        {
            label: "Shift timing",
            icon: shiftTimingIcon,
        },
        {
            label: "Working hours",
            icon: workingHoursIcon,
        },
        {
            label: "Commission profile",
            icon: commissionProfileIcon,
        },
        {
            label: "Staff commission",
            icon: staffCommissionIcon,
        },
        {
            label: "Business closed dates",
            icon: businessClosedDates,
        },
        {
            label: "Time off type",
            icon: staffOffTypeIcon,
        }
    ];

    function renderItem({item}) {
        return <PrimaryButton
            onPress={() => {
                navigation.navigate(capitalizeFirstLetters(item.label));
            }}
            pressableStyle={styles.buttonStyle}
            rippleColor={Colors.ripple}
            buttonStyle={{backgroundColor: Colors.white}}
        >
            <View style={{flexDirection: 'row', gap: 8}}>
                <Image
                    source={item.icon}
                    style={{ width: 24, height: 24}}
                />
                <Text>
                    {item.label}
                </Text>
            </View>

                <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.grey800} />
        </PrimaryButton>
    }



    return <View styles={styles.staffManagementScreen}>
        <View style={styles.listStyle}>
            <FlatList
                data={staffCategories}
                renderItem={renderItem}
                // style={styles.listStyle}
                ItemSeparatorComponent={() => <Divider style={{backgroundColor: Colors.grey400}}/>}
            />
        </View>

    </View>
}

const styles = StyleSheet.create({
    staffManagementScreen: {
        flex: 1,
        alignItems: "center",
    },
    buttonStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 0
    },
    listStyle: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginHorizontal: 16,
        marginTop: 32,
        borderRadius: 6,
        backgroundColor: Colors.white,
        overflow: "hidden",
    }
})