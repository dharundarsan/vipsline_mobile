import {View, StyleSheet, Text} from "react-native";
import colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";

/**
 * clientSalesInfo Component
 *
 * This component displays a card with client sales information, including total sales and last visit.
 * It also includes a button to view more statistics.
 *
 * Props:
 * @param {string} props.totalSales - The total sales amount for the client.
 * @param {string} props.lastVisit - The date of the client's last visit.
 * @param {Function} props.onPress - Function to handle the press event for viewing more statistics.
 * @param {Object} props.salesCard - Optional styling for the sales card container.
 */


export default function clientSalesInfo(props) {
    return (
        <View style={[styles.salesCard, props.salesCard]}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={styles.innerContainer}>
                    <Text style={[textTheme.bodyMedium, {color: Colors.grey650}]}>Total sales</Text>
                    <Text style={textTheme.labelLarge}>{"₹" + props.totalSales}</Text>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={[textTheme.bodyMedium, {color: Colors.grey650}]}>Last visit</Text>
                    <Text style={textTheme.labelLarge}>{props.lastVisit}</Text>
                </View>
            </View>
            <PrimaryButton
                label={"See more statistics"}
                buttonStyle={styles.statisticsButton}
                textStyle={styles.buttonText}
                rippleColor={Colors.white}
                onPress={props.onPress}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    salesCard: {
        borderWidth: 1,
        borderColor: colors.grey250,
        width: '90%',
        borderRadius: 8,
        overflow: 'hidden'
    },
    statisticsButton: {
        backgroundColor: Colors.white
    },
    buttonText: {
        color: Colors.highlight,
    },
    innerContainer: {
        alignItems: 'center',
        padding: 8,
        // borderWidth: 1,
        marginHorizontal: 8
    }
})