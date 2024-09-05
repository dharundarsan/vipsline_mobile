import {Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
import {RadioButton} from "react-native-paper";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateMaxEntry, updateSearchClientMaxEntry} from "../../store/clientFilterSlice";


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

export default function EntryModel(props) {

    const dispatch = useDispatch();

    const [checkedNumber, setCheckedNumber] = useState(10);

    const normalMaxEntry = useSelector(state   => state.clientFilter.maxEntry);
    const searchMaxEntry = useSelector(state   => state.clientFilter.searchMaxEntry);

    useEffect(() => {
        setCheckedNumber(10);
    }, [props.filterPressed]);

    useEffect(() => {
        if(props.query === "") {
            setCheckedNumber(normalMaxEntry);
        }
        else {
            setCheckedNumber(searchMaxEntry);
        }
    }, [normalMaxEntry, searchMaxEntry]);

    return (
        <Modal
            style={{alignItems: 'center', justifyContent: 'center'}}
            visible={props.isModalVisible}
            animationType="slide"
            transparent={true}
        >
            <TouchableOpacity activeOpacity={1} style={{flex:1, justifyContent:"center", backgroundColor:Colors.ripple}} onPress={()=>{
                props.setIsModalVisible(false);
            }}>

            <View style={styles.model}>
                <View style={styles.innerContainer}>
                <Text>10</Text>
                <RadioButton
                    value="first"
                    status={ checkedNumber === 10 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setCheckedNumber(10);
                        props.setIsModalVisible(false);
                        dispatch(updateMaxEntry(10));
                        dispatch(updateSearchClientMaxEntry(10));

                    }}
                />
                </View>
                <View style={styles.innerContainer}>
                    <Text>25</Text>
                    <RadioButton
                        value="first"
                        status={ checkedNumber === 25 ? 'checked' : 'unchecked' }
                        onPress={() => {
                            setCheckedNumber(25);
                            props.setIsModalVisible(false);
                            dispatch(updateMaxEntry(25));
                            dispatch(updateSearchClientMaxEntry(25));

                        }}
                    />
                </View>
                <View style={styles.innerContainer}>
                    <Text>50</Text>
                <RadioButton
                    value="second"
                    status={ checkedNumber === 50 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setCheckedNumber(50)
                        props.setIsModalVisible(false);
                        dispatch(updateMaxEntry(50));
                        dispatch(updateSearchClientMaxEntry(50));
                    }}
                />
                </View>
                <View style={styles.innerContainer}>
                    <Text>100</Text>
                <RadioButton
                    value="third"
                    status={ checkedNumber === 100 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setCheckedNumber(100)
                        props.setIsModalVisible(false);
                        dispatch(updateMaxEntry(100));
                        dispatch(updateSearchClientMaxEntry(100));
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
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    },
})