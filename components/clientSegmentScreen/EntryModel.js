import {Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
import {RadioButton} from "react-native-paper";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {updateMaxEntry} from "../../store/clientFilterSlice";

const modalHeight = 180;

export default function EntryModel(props) {

    const dispatch = useDispatch();

    const [checkedNumber, setCheckedNumber] = useState(10);

    useEffect(() => {
        setCheckedNumber(10);
    }, [props.filterPressed]);

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