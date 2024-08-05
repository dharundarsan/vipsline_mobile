import PrimaryButton from "../../ui/PrimaryButton";
import {Text, TextInput, View, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export default function ForgetPasswordEmailOrNumber({otpHandler}) {
    const navigation = useNavigation();

    return (
        <View style={styles.forgetPasswordBody}>
            <PrimaryButton
                buttonStyle={styles.buttonStyle}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons name="arrow-back-sharp" size={24} color="white" />
            </PrimaryButton>
            <Text style={styles.forgetPasswordText}>Forget Password</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile number / Email</Text>
                <TextInput
                    style={styles.mobileNumberInput}
                    placeholder='Mobile number / email'
                    keyboardType= "number-pad"
                />
            </View>
            <PrimaryButton
                label='Send OTP'
                buttonStyle={{width: '85%', backgroundColor: Colors.highlight, marginTop: 32}}
                textStyle={{color: Colors.onHighlight}}
                onPress={otpHandler}
                >
            </PrimaryButton>

        </View>
    );

}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Colors.grey550,
        width: '20%',
        marginTop: 32,
    },
    forgetPasswordBody: {
        alignItems: "center",
    },
    forgetPasswordText: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: '600',
        marginTop: 32,
    },
    mobileNumberInput: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.highlight,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    inputContainer: {
        marginTop: 32,
        width: '85%',
    },
    inputLabel: {
        marginBottom: 8,
    }
})