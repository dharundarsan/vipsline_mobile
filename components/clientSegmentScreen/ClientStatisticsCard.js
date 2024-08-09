import {View, Text, StyleSheet} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";

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