import {View, Text, StyleSheet, FlatList} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {getBusinessId} from "../../store/cartSlice";
import {loadBusinessClosedDates, updateIsFetching} from "../../store/staffSlice";
import {FAB} from "react-native-paper";
import AddAndUpdateClosedDatesModal from "../../components/staffManagementScreen/AddAndUpdateClosedDatesModal";
import Toast from "../../ui/Toast";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";

export default function BusinessClosedDates() {
    const dispatch = useDispatch();

    const businessClosedDates = useSelector(state => state.staff.businessClosedDates);
    const [refreshing, setRefreshing] = useState(false);
    const [addClosedDatesVisibility, setAddClosedDatesVisibility] = useState(false);
    const [updateClosedDatesVisibility, setUpdateClosedDatesVisibility] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [loading, setLoading] = useState();

    const isFetching = useSelector(state => state.staff.isFetching);

    const toastRef = useRef(null);

    useEffect(() => {
        dispatch(loadBusinessClosedDates());
    }, [])


    function renderItem({item}) {
        return <PrimaryButton
            buttonStyle={styles.button}
            pressableStyle={styles.pressable}
            onPress={() => {
                setCurrentData(item);
                setUpdateClosedDatesVisibility(true);

            }}
        >
            <View style={styles.nameContainer}>
                <Text style={[textTheme.titleMedium]}>{item.name}</Text>
            </View>
            <View style={styles.dateDayContainer}>
                <Text style={[textTheme.bodyMedium, {textAlign: 'center'}]}>{item.no_of_days + (item.no_of_days <= 1 ? " day" : " days")}</Text>
                <Text style={[textTheme.bodyMedium, {textAlign: 'center'}]}>
                    {item.start_date + " .... " + item.end_date}
                </Text>
            </View>
        </PrimaryButton>
    }


    return isFetching ? <ThreeDotActionIndicator color={Colors.highlight}/> :
    <View style={styles.businessClosedDates}>
        {
            addClosedDatesVisibility &&
            <AddAndUpdateClosedDatesModal
                visible={addClosedDatesVisibility}
                onClose={() => setAddClosedDatesVisibility(false)}
                edit={false}
                toastRef={toastRef}
            />
        }
        {
            updateClosedDatesVisibility &&
            <AddAndUpdateClosedDatesModal
                visible={updateClosedDatesVisibility}
                onClose={() => setUpdateClosedDatesVisibility(false)}
                edit={true}
                toastRef={toastRef}
                data={currentData}
            />
        }


        <Toast ref={toastRef}/>
        <FlatList
            data={ businessClosedDates }
            renderItem={renderItem}
            contentContainerStyle={{gap: 6}}
            refreshing={isFetching}
            onRefresh={() => {
                dispatch(updateIsFetching(true));
                dispatch(loadBusinessClosedDates());
                setTimeout(() => {
                    dispatch(updateIsFetching(false));
                }, 1000)
            }}
        />
        <FAB
            icon={"plus"}
            style={styles.addShiftButton}
            color={Colors.white}
            onPress={() => setAddClosedDatesVisibility(true)}
        />
    </View>
}

const styles = StyleSheet.create({
    businessClosedDates: {
        flex: 1
    },
    button: {
        backgroundColor: Colors.white,
    },
    pressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameContainer: {
        width: '50%',
    },
    dateDayContainer: {
        gap: 8
    },
    addShiftButton: {
        backgroundColor: Colors.highlight,
        position: 'absolute',
        bottom: 32,
        right: 32,
    }
})