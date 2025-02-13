import {View, Text, StyleSheet, FlatList} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {Divider, FAB} from "react-native-paper";
import {useEffect, useRef, useState} from "react";
import AddAndUpdateTimeOffTypeModal from "../../components/staffManagementScreen/AddAndUpdateTimeOffTypeModal";
import Toast from "../../ui/Toast";
import {useDispatch, useSelector} from "react-redux";
import {loadTimeOffTypeFromDb, updateIsFetching} from "../../store/staffSlice";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";

export default function StaffTimeOffTypeScreen(props) {
    const dispatch = useDispatch();

    const [addTimeOffTypesVisibility, setAddTimeOffTypesVisibility] = useState(false);
    const [updateTimeOffTypesVisibility, setUpdateTimeOffTypesVisibility] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [refresh, setRefresh] = useState(false);

    const timeOffType = useSelector(state => state.staff.timeOffType);
    const isFetching = useSelector(state => state.staff.isFetching);

    const toastRef = useRef(null);

    useEffect(() => {
        dispatch(loadTimeOffTypeFromDb());
    }, []);

    function renderItem({item}) {
        return <PrimaryButton
            buttonStyle={styles.button}
            pressableStyle={styles.pressable}
            onPress={() => {
                setCurrentData(item);
                setUpdateTimeOffTypesVisibility(true)
            }}
        >
            <Ionicons
                name="reorder-three-outline"
                size={24}
                color={Colors.grey800}
            />
            <View style={styles.nameContainer}>
                <Text style={[textTheme.bodyMedium]}>{item.name}</Text>
            </View>
        </PrimaryButton>
    }




    return isFetching ? <ThreeDotActionIndicator color={Colors.highlight}/> :
    <View style={styles.staffTimeOffType}>
        {
            addTimeOffTypesVisibility &&
            <AddAndUpdateTimeOffTypeModal
                visible={addTimeOffTypesVisibility}
                onClose={() => setAddTimeOffTypesVisibility(false)}
                edit={false}
                toastRef={toastRef}
            />
        }
        {
            updateTimeOffTypesVisibility &&
            <AddAndUpdateTimeOffTypeModal
                visible={updateTimeOffTypesVisibility}
                onClose={() => setUpdateTimeOffTypesVisibility(false)}
                edit
                toastRef={toastRef}
                data={currentData}
            />
        }
        <Toast ref={toastRef}/>
        <View style={styles.labelContainer}>
            <Text> Time off types - Set specific reasons for when you add time off. </Text>
        </View>
        <FlatList
            data={timeOffType}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider />}
            refreshing={refresh}
            onRefresh={() => {
                dispatch(updateIsFetching(true));
                dispatch(loadTimeOffTypeFromDb());
                setTimeout(() => {
                    dispatch(updateIsFetching(false));
                }, 1000)
            }}

        />
        <FAB
            icon={"plus"}
            style={styles.addShiftButton}
            color={Colors.white}
            onPress={() => setAddTimeOffTypesVisibility(true)}
        />
    </View>
}

const styles = StyleSheet.create({
    staffTimeOffType: {
        flex: 1,
    },
    pressable: {
        flexDirection: "row",
    },
    button: {
        borderRadius: 0,
        backgroundColor: Colors.white
    },
    nameContainer: {
        flex: 1,
        marginLeft: 8,
    },
    labelContainer: {
        marginVertical: 16,
        alignSelf: 'center'
    },
    addShiftButton: {
        backgroundColor: Colors.highlight,
        position: 'absolute',
        bottom: 32,
        right: 32,
    }

})