import {Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RadioButton from "./../../ui/RadioButton"
import {updateMaxEntry} from "../../store/ExpensesSlice";


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

export default function EntryModal(props) {

    const dispatch = useDispatch();

    const [checkedNumber, setCheckedNumber] = useState(10);

    const normalMaxEntry = useSelector(state => state.expenses.maxEntry);
    const searchMaxEntry = useSelector(state => state.expenses.searchMaxEntry);

    const maxEntry = useSelector(state => state.expenses.maxEntry);

    const options = [
        {label: '10', value: 10},
        {label: '25', value: 25},
        {label: '50', value: 50},
        {label: '100', value: 100},
    ];

    console.log(checkedNumber)


    useEffect(() => {
        if (props.query === "") {
            setCheckedNumber(normalMaxEntry);
        } else {
            setCheckedNumber(searchMaxEntry);
        }
    }, [normalMaxEntry, searchMaxEntry]);

    return (
        <Modal
            style={{alignItems: 'center', justifyContent: 'center'}}
            visible={props.isModalVisible}
            animationType="fade"
            transparent={true}
            presentationStyle={"formSheet"}
            onRequestClose={props.setIsModalVisible(false)}
        >
            <TouchableOpacity activeOpacity={1}
                              style={{flex: 1, justifyContent: "center", backgroundColor: Colors.dim}}
                              onPress={() => {
                                  props.setIsModalVisible(false);
                              }}>

                <View style={styles.model}>
                    <View style={styles.innerContainer}>
                        <RadioButton
                            options={options}
                            value={checkedNumber}
                            onPress={(value) => {
                                setCheckedNumber(value)
                                props.setIsModalVisible(false);
                                dispatch(updateMaxEntry(value));
                            }}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    model: {
        justifyContent: "center",
        alignItems: "center",
        width: '70%',
        height: modalHeight,
        backgroundColor: Colors.grey200,
        borderRadius: 24,
        margin: 'auto',
        borderWidth: 1.5,
        overflow: 'hidden'
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',

    },
})