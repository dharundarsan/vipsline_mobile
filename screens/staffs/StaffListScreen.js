import {Text, View, StyleSheet, FlatList} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {useEffect, useRef, useState} from "react";
import {updateNavigationState} from "../../store/NavigationSlice";
import {useDispatch, useSelector} from "react-redux";
import {FAB} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import AddStaffModal from "../../components/staffManagementScreen/addStaffModal";
import {loadStaffsFromDB} from "../../store/staffSlice";
import Toast from "../../ui/Toast";
import {capitalizeFirstLetter} from "../../util/Helpers";
import StaffCard from "../../components/staffManagementScreen/StaffCard";

const RADIUS = 50;

export default function StaffListScreen() {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(updateNavigationState("Staff List"));
        dispatch(loadStaffsFromDB());
    }, []);



    const [refresh, setRefresh] = useState(false)
    const [addStaffModalVisibility, setAddStaffModalVisibility] = useState(false)

    const staffs = useSelector((state) => state.staff.staffs);

    const toastRef = useRef(null);
    



    function renderItem({item}) {
        return <StaffCard
            onPress={() => {
                navigation.navigate("Staff Name", {
                    name: item.name,
                    id : staffs.find((staff) => staff.id === item.id).id
                })

            }}
            name={item.name}
        />
    }


    return <View style={styles.staffListScreen}>
        <Toast
            ref={toastRef}
        />

        {
            addStaffModalVisibility &&
            <AddStaffModal
                isVisible={addStaffModalVisibility}
                onClose={() => setAddStaffModalVisibility(false)}
                toastRef={toastRef}
            />
        }

        <FlatList
            data={staffs}
            renderItem={renderItem}
            refreshing={refresh}
            onRefresh={() => {
                setRefresh(true)
                setTimeout(() => {
                    dispatch(loadStaffsFromDB());
                    setRefresh(false)
                }, 1000)
            }}

        />
        <FAB
            icon={"plus"}
            style={styles.plusIcon}
            rippleColor={Colors.ripple}
            color={Colors.white}
            onPress={() => setAddStaffModalVisibility(true)}

        />


    </View>
}

const styles = StyleSheet.create({
    staffListScreen: {
        flex: 1,
    },
    staffCard: {
        borderWidth: 0.5,
        borderColor: Colors.grey550,
        backgroundColor: Colors.white,
        borderRadius: 0
    },
    staffCardPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    staffAvatar: {
        borderWidth: 1.5,
        borderColor: Colors.lightBlue,
        width: RADIUS,
        height: RADIUS,
        borderRadius: RADIUS / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.highlight50
    },
    plusIcon: {
        position: 'absolute',
        bottom: 38,
        right: 38,
        backgroundColor: Colors.highlight,


    }
})