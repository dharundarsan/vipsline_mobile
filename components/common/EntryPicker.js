import {Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
import {useEffect, useState} from "react";
import RadioButton from "./../../ui/RadioButton"


const modalHeight = 220;

export default function EntryPicker(props) {

    const [checkedNumber, setCheckedNumber] = useState(10);

    const options = [
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
    ];

    useEffect(() => {
        setCheckedNumber(props?.maxEntry);
    }, [props?.maxEntry]);

    
    
    // useEffect(() => {
    //     if (props?.query !== undefined ) {
    //         setCheckedNumber(props?.normalMaxEntry);
    //     } else {
    //         setCheckedNumber(props?.searchMaxEntry);
    //     }
    // }, [props?.normalMaxEntry, props?.searchMaxEntry]);

    return (
        <Modal
            visible={props.isModalVisible}
            animationType="fade"
            transparent={true}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.overlay}
                onPress={() => {
                    
                    props.setIsModalVisible(false)}}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Max Count</Text>
                    <View style={styles.innerContainer}>
                        <RadioButton
                            options={options}
                            value={props.maxEntry}
                            onPress={(value)=>{
                                props.onPress(value)
                            }
                        }
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
