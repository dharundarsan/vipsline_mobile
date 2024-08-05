import {StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";


const ProductItem = (props) => {
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        selectProductItemButton: {
            // padding: 15,
            elevation: 1,
            marginHorizontal: 15,
            borderRadius: 8,
            marginVertical: 5,
            backgroundColor: Colors.background,
            borderColor: Colors.blue,
            borderWidth: props.selected ? 1 : 0,
        },
        selectProductItemPressable: {
            borderRadius: 8,
            paddingVertical: 15,
            paddingHorizontal: 15,
            gap: 5,
        },
        nameAndPriceContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
        },
        priceContainer: {
            flexDirection: "row",
            gap: 15,
        },
        lineThroughPrice: {
            textDecorationLine: "line-through",
            color: Colors.error
        },
        barCodeText: {
            alignSelf: "flex-start",
            color: Colors.grey600
        }
    });

    return <PrimaryButton buttonStyle={styles.selectProductItemButton}
                          pressableStyle={styles.selectProductItemPressable}
                          onPress={() => {
                              props.addToTempSelectedItems(props.data);
                              dispatch(addItemToCart(props.data));
                          }}
    >
        <View style={styles.nameAndPriceContainer}>
            <Text style={textTheme.bodyMedium}>{props.data.name}</Text>
            <View style={styles.priceContainer}>
                {
                    props.data.price === props.data.discounted_price ? <>
                        <Text style={[textTheme.titleSmall,]}>{"₹ " + props.data.price}</Text>
                    </> : <>
                        <Text style={[textTheme.titleSmall, styles.lineThroughPrice]}>{"₹ " + props.data.price}</Text>
                        <Text style={[textTheme.titleSmall,]}>{"₹ " + props.data.discounted_price}</Text>
                    </>
                }
            </View>
        </View>
        {props.data.barCode !== "" ? <Text style={styles.barCodeText}>{props.data.barCode}</Text> : null}
    </PrimaryButton>

}

export default ProductItem;