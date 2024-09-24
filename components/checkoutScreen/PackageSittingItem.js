import {StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import Entypo from "@expo/vector-icons/Entypo";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import {useDispatch} from "react-redux";
import {addItemToCart, removeItemFromCart} from "../../store/cartSlice";
import * as Haptics from "expo-haptics";

const PackageSittingItem = (props) => {
    const [filteredEditedData, setFilteredEditedData] = useState([])
    const [sittingCount, setSittingCount] = useState(0);
    // const [sittingCount, setSittingCount] = useState( 0);
    const [isMaxReached, setIsMaxReached] = useState(false);
    const [isMinReached, setIsMinReached] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.edited) {
            const filteredData = props.editedData.filter(item =>
                item.name === props.data.name &&
                item.parent_resource_category_id === props.data.par_res_cat_id &&
                item.resource_category_id === props.data.res_cat_id
            );
            setFilteredEditedData(filteredData);

            if (filteredData.length > 0) {
                setSittingCount(filteredData[0].counter);
                setIsMaxReached(filteredData[0].counter === props.data.available_quantity);
                setIsMinReached(filteredData[0].counter === 0);
            }
        }
    }, [props.editedData, props.data]);

    useEffect(() => {
        if (sittingCount === 0) {
            setIsMinReached(true);
        } else {
            setIsMinReached(false);
        }

        if (sittingCount === props.data.available_quantity) {
            setIsMaxReached(true);
        } else {
            setIsMaxReached(false);
        }
    }, [sittingCount]);


    return <View style={styles.editPackageItem}>
        <Text style={[textTheme.titleMedium]}>{props.data.name}</Text>
        <View style={styles.editPackageItemInnerRow}>
            <View style={styles.quantityDetailsContainer}>
                <Text style={[textTheme.bodySmall]}>Total
                    Sessions {props.data.total_quantity}</Text>
                <Text style={[textTheme.bodySmall]}>Available
                    Sessions {props.data.available_quantity}</Text>
            </View>
            <View style={styles.quantityToggleContainer}>
                {props.data.available_quantity === 0 ?
                    <Text style={textTheme.titleSmall}>Redeemed</Text> :
                    <>
                        <PrimaryButton rippleColor={isMinReached ? Colors.transparent : `rgba(0, 0, 0, 0.1)`}
                                       onPress={
                                           isMinReached ? () => {
                                               } :
                                               props.edited ? async () => {

                                                       props.editSittingCountInEditedPackageDetails({
                                                           ...filteredEditedData[0],
                                                           counter: sittingCount - 1
                                                       })
                                                       setSittingCount(prev => prev - 1)
                                                   }
                                                   :
                                                   () => {

                                                       props.deleteSittingItems(props.data);
                                                       setSittingCount(prev => prev - 1)
                                                   }
                                       } buttonStyle={[styles.toggleButton, {
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0
                        }]}
                                       pressableStyle={styles.togglePressable}>
                            <Entypo name="minus" size={18} color={isMinReached ? Colors.grey500 : Colors.black}/>
                        </PrimaryButton>
                        <Text>{sittingCount}</Text>
                        <PrimaryButton rippleColor={isMaxReached ? Colors.transparent : `rgba(0, 0, 0, 0.1)`}
                                       onPress={
                                           isMaxReached ? () => {
                                               } :
                                               props.edited ? () => {

                                                       props.editSittingCountInEditedPackageDetails({
                                                           ...filteredEditedData[0],
                                                           counter: sittingCount + 1
                                                       })
                                                       setSittingCount(prev => prev + 1)
                                                   } :
                                                   () => {

                                                       props.addSittingItems(props.data);
                                                       setSittingCount(prev => prev + 1)
                                                   }} buttonStyle={[styles.toggleButton, {
                            borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0
                        }]}
                                       pressableStyle={styles.togglePressable}>
                            <Entypo name="plus" size={18} color={isMaxReached ? Colors.grey500 : Colors.black}/>
                        </PrimaryButton>
                    </>}

            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    editPackageItem: {
        borderWidth: 1,
        borderColor: Colors.grey300,
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
    },
    editPackageItemInnerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    quantityDetailsContainer: {
        marginTop: 8,
        gap: 5,
    },
    quantityToggleContainer: {
        alignItems: "center",
        alignSelf: "flex-start",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.grey300,
        borderRadius: 5,
        gap: 10,
    },
    toggleButton: {
        backgroundColor: Colors.grey300,
        borderRadius: 5,
    },
    togglePressable: {
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
})

export default PackageSittingItem;