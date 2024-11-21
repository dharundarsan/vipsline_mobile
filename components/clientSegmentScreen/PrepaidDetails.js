import {View, Text, StyleSheet, FlatList, Image} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {useState} from "react";
import PrepaidDetailModal from "./PrepaidDetailModal";

export function PrepaidDetails(props) {
    const [isVisible, setIsVisible] = useState(false)


    return <View style={styles.prepaidDetails}>
        {
            isVisible &&
            <PrepaidDetailModal
                visible={isVisible}
                closeModal={() => setIsVisible(false)}
            />

        }




        <Text style={[textTheme.titleMedium, styles.title]}>Prepaid</Text>


        <View style={styles.card}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                    <Image
                        source={require("../../assets/icons/prepaidAvatar.png")}
                        style={{height: 40, width: 40}}
                    />
                    <Text style={[textTheme.titleMedium]}>Prepaid Balance</Text>
                </View>

                <Text style={[textTheme.titleMedium]}>
                    ₹{props.details.wallet_balance}
                </Text>
            </View>

            <PrimaryButton
                label={"View Prepaid History"}
                buttonStyle={styles.buttonStyle}
                textStyle={[textTheme.titleMedium, styles.buttonLabelStyle]}
                onPress={() => setIsVisible(true)}
            />
        </View>


    </View>
}

const styles = StyleSheet.create({
    prepaidDetails: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        paddingVertical: 16
    },
    card :{
        borderWidth: 1,
        borderRadius: 6,
        width: '100%',
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderColor: Colors.grey250
    },
    buttonStyle:{
        alignSelf: 'flex-end',
        marginTop: 16,
        backgroundColor: Colors.white,
        borderWidth :1,
        borderColor: Colors.highlight,
        borderRadius: 6
    },
    buttonLabelStyle: {
        color: Colors.highlight
    }
})

