import {StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {capitalizeFirstLetter} from "../../util/Helpers";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";

const PackageItem = (props) => {
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        packageItemButton: {
            margin: 10,
            borderWidth: 1,
            borderColor: props.selected ? Colors.blue : Colors.grey400,
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: Colors.transparent,
        },
        packageItemPressable: {
            paddingHorizontal: 30,
            paddingVertical: 10,
        },
        packageItemInnerContainer: {
            width: "100%",
        },
        leftBar: {
            position: "absolute",
            backgroundColor: Colors.darkGreen,
            width: 5,
            height: "200%",
            left: 0,
        },
        nameText: {
            marginBottom: 10,
        },
        validityAndSessionText: {
            color: Colors.grey600,
            marginBottom: 5,
        },
        priceText: {},
        discountText: {
            textDecorationLine: "line-through",
            color: Colors.highlight,
        },
        discountAndPriceContainer: {
            flexDirection: "row",
            gap: 15,
        }
    })

    return <PrimaryButton buttonStyle={styles.packageItemButton} pressableStyle={styles.packageItemPressable}
                          onPress={() => {
                              props.addToTempSelectedItems(props.data);
                              dispatch(addItemToCart(props.data));
                          }}>
        <View style={styles.leftBar}></View>
        <View style={styles.packageItemInnerContainer}>
            <Text style={[styles.nameText, textTheme.titleMedium]}>{capitalizeFirstLetter(props.data.name)}</Text>
            <Text style={[styles.validityAndSessionText, textTheme.labelLarge]}>Validity: {props.data.duration} Days •
                Sessions: {props.data.total_sittings}</Text>
            <View style={styles.discountAndPriceContainer}>
                {props.data.discount_value !== 0 ?
                    <Text
                        style={[textTheme.titleMedium, styles.discountText]}>₹ {props.data.package_cost}</Text> : null}
                <Text style={[textTheme.titleMedium, styles.priceText]}>₹ {props.data.price}</Text>
            </View>
        </View>
    </PrimaryButton>;
}


export default PackageItem;