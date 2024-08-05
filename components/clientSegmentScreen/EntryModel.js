import {Modal, View, Text, StyleSheet, useWindowDimensions, Dimensions, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors"
import {RadioButton} from "react-native-paper";
import {useEffect, useState} from "react";

const modalHeight = 150;

export default function EntryModel(props) {

    const [isChecked, setIsChecked] = useState(10);

    useEffect(() => {
        props.setMaxEntry(isChecked);
    }, [isChecked]);



    return (
        <Modal
            style={{alignItems: 'center', justifyContent: 'center'}}
            visible={props.isModalVisible}
            animationType="slide"
            transparent={true}
        >
            <TouchableOpacity style={{flex:1, justifyContent:"center"}} onPress={()=>{
                props.setIsModalVisible(false);
            }}>

            <View style={styles.model}>
                <View style={styles.innerContainer}>
                <Text>10</Text>
                <RadioButton
                    value="first"
                    status={ isChecked === 10 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setIsChecked(10);
                        props.setIsModalVisible(false);
                    }}
                />
                </View>
                <View style={styles.innerContainer}>
                    <Text>50</Text>
                <RadioButton
                    value="second"
                    status={ isChecked === 50 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setIsChecked(50)
                        props.setIsModalVisible(false);
                    }}
                />
                </View>
                <View style={styles.innerContainer}>
                    <Text>100</Text>
                <RadioButton
                    value="third"
                    status={ isChecked === 100 ? 'checked' : 'unchecked' }
                    onPress={() => {
                        setIsChecked(100)
                        props.setIsModalVisible(false);
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
        backgroundColor: Colors.grey250,
        borderRadius: 24,
        margin: 'auto'
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    }
})