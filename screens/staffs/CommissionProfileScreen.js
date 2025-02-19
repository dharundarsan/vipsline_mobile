import {Text, View, StyleSheet, FlatList, Dimensions} from "react-native";
import {Divider, FAB} from "react-native-paper";
import Colors from "../../constants/Colors";
import AddAndUpdateCommissionProfile from "../../components/staffManagementScreen/AddAndUpdateCommissionProfile";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PrimaryButton from "../../ui/PrimaryButton";
import {getListOfCommissionProfile, updateListOfDataForStaffCommission1} from "../../store/staffSlice";
import textTheme from "../../constants/TextTheme";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";
import Toast from "../../ui/Toast";

const paddingForAddCommissionButton = 30;
const windowHeight = Dimensions.get("window").height;

export default function CommissionProfileScreen(props) {
    const dispatch = useDispatch();

    const [addAndUpdateCommissionVisibility, setAddAndUpdateCommissionVisibility] = useState(false);
    const [editCommission, setEditCommission] = useState(false);
    const commissionProfile = useSelector(state => state.staff.commissionProfile);
    const [refresh, setRefresh] = useState(false);
    const isFetching = useSelector(state => state.staff.isFetching);
    const [currentCommissionId, setCurrentCommissionId] = useState("");
    const [currentCommissionType, setCurrentCommissionType] = useState(1);
    const [currentDate, setCurrentDate] = useState("")

    const toastRef = useRef(null);

    useEffect(() => {
        dispatch(getListOfCommissionProfile());
    }, [])

    function renderItem({item}) {
        const [date, month_year, time, noon] = item.updatedAt.split(" ");

        return <PrimaryButton
            buttonStyle={styles.buttonStyle}
            pressableStyle={styles.buttonPressable}
            onPress={() => {
                setCurrentDate(item)
                setCurrentCommissionId(item.id);
                setCurrentCommissionType(item.profile_type === "commission by item" ? 1 : 2)
                setEditCommission(true);
                setAddAndUpdateCommissionVisibility(true);
            }}
        >
            <View style={styles.buttonInnerContainer}>
                <Text style={[textTheme.bodyMedium, {width: "60%"}]}>{item.profile_name}</Text>
                <Text style={[textTheme.bodyMedium]}>{item.profile_type}</Text>
            </View>
            <View style={styles.buttonInnerContainer}>
                <Text style={[textTheme.bodyMedium]}>{`${date} ${month_year}`}</Text>
                <Text style={[textTheme.bodyMedium]}>{`${time} ${noon}`}</Text>
            </View>
        </PrimaryButton>
    }


    return <View style={styles.commissionProfile}>

        <Toast ref={toastRef}/>

        {
            addAndUpdateCommissionVisibility &&
            <AddAndUpdateCommissionProfile
                visible={addAndUpdateCommissionVisibility}
                onClose={() => {
                    // dispatch(updateListOfDataForStaffCommission1({
                    //     Services: [],
                    //     Products: [],
                    //     Membership: [],
                    //     Packages: [],
                    //     Prepaid: [],
                    //     Custom_services: [],
                    // }));
                    setAddAndUpdateCommissionVisibility(false)
                }}
                edit={editCommission}
                id={currentCommissionId}
                profileType={currentCommissionType}
                data={currentDate}
                toastRef={toastRef}

            />
        }
        {
            isFetching ?
                <ThreeDotActionIndicator
                    color={Colors.highlight}
                /> :
                <FlatList
                    data={commissionProfile}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Divider />}
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefresh(true);
                        dispatch(getListOfCommissionProfile());
                        setTimeout(() => {
                            setRefresh(false)
                        }, 1000)
                    }}
                    ListEmptyComponent={() => {
                        return<Text style={[textTheme.titleMedium, {textAlign: 'center', marginTop: windowHeight / 2.2}]}>
                            No Commission profile
                        </Text>
                    }}
                    style={styles.flatList}

                />
        }

        <FAB
            icon={"plus"}
            style={styles.addCommissionProfileButton}
            color={Colors.white}
            onPress={() => {
                setEditCommission(false)
                setAddAndUpdateCommissionVisibility(true)
            }}
        />





    </View>
}

const styles = StyleSheet.create({
    commissionProfile: {
        flex: 1,
        alignItems: 'center',
        position: "relative"
    },
    addCommissionProfileButton: {
        position: 'absolute',
        right: paddingForAddCommissionButton,
        bottom: paddingForAddCommissionButton,
        backgroundColor: Colors.highlight,
        zIndex: 1
    },
    buttonStyle: {
        backgroundColor: Colors.white,

    },
    buttonPressable: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        gap: 8
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    flatList: {
        width: '100%',
    }
})