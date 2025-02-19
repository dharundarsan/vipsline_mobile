import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import CustomTextInput from './CustomTextInput';
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme"; // Assuming it's imported correctly

const PriceInput = ({
                        priceToggle,
                        container,
                        onOnchangeText,
                        innerContainerStyle,
                        readOnly,
                        value,
                        defaultValue,
                        onEndEditing
}) => {
    const borderLeftWidthColor = {
        borderLeftWidth: 1,
        borderLeftColor: Colors.grey400,
    };

    const borderRightWidthColor = {
        borderRightWidth: 1,
        borderRightColor: Colors.grey400,
    };

    return (
        <View
            style={[
                styles.percentOrValueForItemContainer,
                container,
                {
                    flexDirection: priceToggle === "PERCENTAGE" ? "row" : "row-reverse",
                },
            ]}
        >
            <CustomTextInput
                type={"number"}
                labelEnabled={false}
                container={{ marginBottom: 0, width: "70%" }}
                textInputStyle={{marginVertical: 0, borderRadius: 0, borderWidth: 0,}}
                flex
                onChangeText={(text) => onOnchangeText === undefined ? {} : onOnchangeText(text)}
                readOnly={readOnly}
                value={value}
                defaultValue={defaultValue}
                onEndEditing={onEndEditing}

            />
            <View
                style={[
                    styles.percentOrValueForItemAmountType,
                    innerContainerStyle,
                    priceToggle === "PERCENTAGE" ? borderLeftWidthColor : borderRightWidthColor,
                ]}
            >
                <Text style={[textTheme.bodyMedium]}>
                    {priceToggle === "PERCENTAGE" ? "%" : "₹"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    percentOrValueForItemContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        // justifyContent: "flex-end",
        overflow: "hidden",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.grey400,
        width: "60%",
        flex: 1


    },
    percentOrValueForItemAmountType: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.highlight50,
    },
})






export default PriceInput;

