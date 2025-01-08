import {Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
// import {RadioButton} from "react-native-paper";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateMaxEntry, updateSearchClientMaxEntry} from "../../store/clientFilterSlice";
import RadioButton from "./../../ui/RadioButton"
import {updatePageNo, updateSalesMaxEntry} from "../../store/clientInfoSlice";


/**
 * EntryModel Component
 *
 * This component displays a modal with radio buttons that allow users to select the maximum number of entries (10, 25, 50, 100) to be displayed. The selected value updates the state and Redux store.
 *
 * Props:
 * @param {boolean} isModalVisible - Controls the visibility of the modal.
 * @param {function} setIsModalVisible - Function to close the modal.
 * @param {boolean} filterPressed - Trigger to reset the selection to the default value.
 * @param {string} query - The search query to determine whether to use normalMaxEntry or searchMaxEntry.
 */


const modalHeight = 180;

export default function EntryBoxModal(props) {

    const dispatch = useDispatch();

    const [checkedNumber, setCheckedNumber] = useState(10);


    const [selectedOption, setSelectedOption] = useState(null);

    const maxEntry = useSelector(state => state.clientInfo.maxEntry)

    const options = [
        {label: '10', value: 10},
        {label: '25', value: 25},
        {label: '50', value: 50},
        {label: '100', value: 100},
    ];


    useEffect(() => {
        setCheckedNumber(maxEntry);
        dispatch(updatePageNo(0));
    }, [maxEntry]);

    return (
        <Modal
            visible={props.isModalVisible}
            animationType="fade"
            transparent={true}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.overlay}
                onPress={() => props.setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Max Count</Text>
                    <View style={styles.innerContainer}>
                        <RadioButton
                            options={options}
                            value={checkedNumber}
                            onValueChange={setSelectedOption}
                            onPress={(value) => {
                                setCheckedNumber(value);
                                props.setIsModalVisible(false);
                                dispatch(updateSalesMaxEntry(value))
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 10,
    },
    innerContainer: {
        width: '100%',
        paddingVertical: 15,
    },
});