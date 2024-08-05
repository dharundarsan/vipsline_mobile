import {View, Text, StyleSheet} from 'react-native';
import SignInHeader from "../components/authScreen/SignInHeader";
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import {StatusBar} from "expo-status-bar";
import VerificationCodeBody from "../components/verificationCodeScreen/VerificationCodeBody"



export default function VerificationCodeScreen({navigation}) {
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar style="light" />
        <View style={styles.verificationCodeScreen}>
            <SignInHeader />
            <VerificationCodeBody />

        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    verificationCodeScreen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeAreaView: {
        backgroundColor: Colors.onBackground,
        flex: 1
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
})