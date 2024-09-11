import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import PrimaryButton from "../ui/PrimaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch} from "react-redux";
import {updateAuthStatus} from "../store/authSlice";

const SignOutPrompt = ({ navigation }) => {

    const dispatch = useDispatch();

    const handleSignOut = async () => {
        // Perform the sign-out action (e.g., clear storage, navigate to login screen)

        try {
            await AsyncStorage.removeItem('authKey');
            dispatch(updateAuthStatus(false));
        } catch (e) {
                    }
        try {
            await AsyncStorage.removeItem('businessId');
            dispatch(updateAuthStatus(false));
        } catch (e) {
                    }
        Alert.alert("Signed out", "You have been signed out successfully.");
        navigation.navigate("Checkout");

    };

    const showSignOutAlert = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Sign out canceled"),
                    style: "cancel"
                },
                { text: "Yes", onPress: handleSignOut }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Out</Text>
            <Text style={styles.message}>Are you sure you want to sign out?</Text>
            <View style={styles.buttonContainer}>
                <PrimaryButton label="Yes" onPress={ async () => await handleSignOut()} buttonStyle={{width: "40%"}}/>
                <PrimaryButton label="No" onPress={() => null} buttonStyle={{width: "40%"}}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    message: {
        fontSize: 16,
        marginBottom: 30
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    }
});

export default SignOutPrompt;
