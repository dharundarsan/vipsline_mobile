import {View, Text, StyleSheet, FlatList} from "react-native";
import {Divider, FAB} from "react-native-paper";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {useCallback, useEffect, useRef, useState} from "react";
import AddShiftTimingModal from "../../components/staffManagementScreen/AddShiftTimingModal";
import Toast from "../../ui/Toast";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import {loadShiftTiming} from "../../store/staffSlice";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";

export default function ShiftTiming()  {

    const dispatch = useDispatch();

    const shiftTiming = useSelector(state => state.staff.shiftTiming);

    const [addShiftTimingVisibility, setAddShiftTimingVisibility] = useState(false);
    const [updateShiftTimingModalVisibility, setUpdateShiftTimingModalVisibility] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [currentSelectedData, setCurrentSelectedData] = useState({})
    const isFetching = useSelector(state => state.staff.isFetching);

    const toastRef = useRef();

    useEffect(() => {
        dispatch(loadShiftTiming());
    }, []);

    function renderItem({item}) {
        return <PrimaryButton
            buttonStyle={styles.shiftCard}
            pressableStyle={styles.shiftCardPressable}
            onPress={() => {
                setCurrentSelectedData(item);
                setUpdateShiftTimingModalVisibility(true)
            }}
        >
            <Text>{item.name}</Text>
            <View style={styles.timingContainer}>
                <Text>{item.start_time}</Text><Text>{"  ......  " + item.end_time}</Text>
            </View>
        </PrimaryButton>
    }


    return isFetching ? <ThreeDotActionIndicator color={Colors.highlight}/> :
    <View style={styles.shiftTiming}>
        {
            addShiftTimingVisibility &&
            <AddShiftTimingModal
                visible={addShiftTimingVisibility}
                onClose={() => setAddShiftTimingVisibility(false)}
                toastRef={toastRef}
                edit={false}
            />

        }
        {
            updateShiftTimingModalVisibility &&
            <AddShiftTimingModal
                visible={updateShiftTimingModalVisibility}
                onClose={() => setUpdateShiftTimingModalVisibility(false)}
                toastRef={toastRef}
                edit
                data={currentSelectedData}
            />
        }
        <Toast ref={toastRef}/>

        <FlatList
            data={shiftTiming}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider />}
            style={styles.flatList}
            contentContainerStyle={styles.contentContainer}
            refreshing={refresh}
            onRefresh={() => {
                setRefresh(true);
                dispatch(loadShiftTiming());
                setTimeout(() => {
                    setRefresh(false);
                }, 800)
            }}

        />
        <FAB
            icon={"plus"}
            style={styles.addShiftButton}
            color={Colors.white}
            onPress={() => setAddShiftTimingVisibility(true)}
        />

    </View>
}

const styles = StyleSheet.create({
    shiftTiming: {
        flex: 1,
    },
    shiftCard: {
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 0,

    },
    shiftCardPressable: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 24
    },
    timingContainer: {
        flexDirection: "row"
    },
    flatList: {
    },
    contentContainer: {
        gap: 4
    },
    addShiftButton: {
        backgroundColor: Colors.highlight,
        position: 'absolute',
        bottom: 32,
        right: 32,
    }
})