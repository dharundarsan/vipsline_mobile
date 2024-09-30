import {View, Text, StyleSheet} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";

/**
 * ClientStatisticsCard Component
 *
 * This component is used to display a single statistic in a card format. It shows a label and its corresponding value.
 *
 * Props:
 * @param {string} props.label - The label for the statistic (e.g., "Total Visit").
 * @param {string} props.value - The value corresponding to the statistic label.
 * @param {object} props.containerStyle - Additional styles for the card container.
 * @param {object} props.labelStyle - Additional styles for the label text.
 * @param {object} props.valueStyle - Additional styles for the value text.
 */


export default function ClientStatisticsCard(props) {
    return(
        <View style={[styles.container, props.containerStyle]}>
            <View style={{justifyContent: 'center',alignItems: 'center'}}>
                <Text style={[textTheme.titleSmall, styles.label, props.label]}>
                    {props.label}
                </Text>
                <Text style={[textTheme.titleMedium, styles.value, props.value]}>
                    {props.value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        elevation: 0,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.grey250,
        justifyContent: 'center',
        alignItems: 'center',

    },
    label: {
        color: Colors.grey650
    }
})