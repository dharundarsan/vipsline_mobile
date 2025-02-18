import Colors from "../../constants/Colors";
import {Text, View, StyleSheet} from "react-native";
import textTheme from "../../constants/TextTheme";
import {capitalizeFirstLetter, checkNullUndefined} from "../../util/Helpers";
import PrimaryButton from "../../ui/PrimaryButton";


const RADIUS = 50;

export default function StaffCard(props) {
    return <PrimaryButton
        buttonStyle={[styles.staffCard, props.staffCard]}
        pressableStyle={[styles.staffCardPressable, props.staffCardPressable]}
        rippleColor={Colors.ripple}
        onPress={props.onPress}
        {...props}
    >
        <View style={[styles.staffAvatar, props.staffAvatar]} >
            <Text style={[textTheme.titleMedium, {color: Colors.highlight, fontSize: 16, textAlign: "center"}]}>
                {props.name.charAt(0).toUpperCase()}
            </Text>
        </View>
        {
            props.nameShown === undefined ?
                <Text style={[textTheme.labelLarge, props.staffTextStyle]}>{capitalizeFirstLetter(props.name)}</Text> :
                <></>

        }
        {props.children}
    </PrimaryButton>
}

const styles = StyleSheet.create({
    staffCard: {
        borderWidth: 0.5,
        borderColor: Colors.grey550,
        backgroundColor: Colors.white,
        borderRadius: 0
    },
    staffCardPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    staffAvatar: {
        borderWidth: 1.5,
        borderColor: Colors.lightBlue,
        width: RADIUS,
        height: RADIUS,
        borderRadius: RADIUS / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.highlight50
    },
})