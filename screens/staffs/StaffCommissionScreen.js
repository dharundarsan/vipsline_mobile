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
import {getListOfCommissionProfile, loadStaffsFromDB} from "../../store/staffSlice";
import Toast from "../../ui/Toast";
import {capitalizeFirstLetter, checkNullUndefined} from "../../util/Helpers";
import StaffCard from "../../components/staffManagementScreen/StaffCard";
import AssignAndReAssignCommissionProfileModal
    from "../../components/staffManagementScreen/AssignAndReAssignCommissionProfileModal";

const RADIUS = 50;

export default function StaffCommissionScreen() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateNavigationState("Staff Commission"));

    }, []);



    const [refresh, setRefresh] = useState(false)

    const staffs = useSelector((state) => state.staff.staffs);
    const [AssignAndReAssignCommissionProfileVisibility, setAssignAndReAssignCommissionProfileVisibility] = useState();
    const commissionProfile = useSelector(state => state.staff.commissionProfile);
    const [staffCommissionPair, setStaffCommissionPair] = useState([]);
    const [currentData, setCurrentData] = useState({});
    const [toggle, setToggle] = useState(false)


    const toastRef = useRef(null);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        dispatch(loadStaffsFromDB()).then((staffs1) => {
            dispatch(getListOfCommissionProfile()).then((commissionProfile1) => {
                setStaffCommissionPair(
                    staffs1.map((staff) => {
                        const profileObject = commissionProfile1.find((profile) => profile.id === staff.commission_id)
                        return {
                            name: staff.name,
                            profile:  profileObject && checkNullUndefined(profileObject.profile_name) ? profileObject.profile_name : "no_matching_found",
                            resource_id: staff.id,
                        }
                    })
                )
            })

        })
    }, [toggle]);


    function renderItem({item}) {
        return <StaffCard
            onPress={() => {
                setCurrentData(item)
                setEdit(item.profile !== "no_matching_found")
                setAssignAndReAssignCommissionProfileVisibility(true)
            }}
            name={item.name}
            staffCardPressable={{}}

        >
            <Text style={[textTheme.titleMedium, {position: "absolute", right: 40}]}>
                {
                    item.profile === "no_matching_found" ?
                        "  -  " :
                        item.profile
                }
            </Text>

        </StaffCard>
    }



    return <View style={styles.staffListScreen}>
        <Toast
            ref={toastRef}
        />

        {
            AssignAndReAssignCommissionProfileVisibility &&
            <AssignAndReAssignCommissionProfileModal
                visible={AssignAndReAssignCommissionProfileVisibility}
                onClose={async () => {
                    setAssignAndReAssignCommissionProfileVisibility(false);

                }}
                edit={edit}
                profiles={commissionProfile}
                data={currentData}
                toastRef={toastRef}
                setToggle={setToggle}
            />
        }


        <FlatList
            data={staffCommissionPair}
            renderItem={renderItem}
            removeClippedSubviews={false}

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