import React, { useCallback } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import PrimaryButton from "../../ui/PrimaryButton";
import {useDispatch} from "react-redux";
import {clearBusinessId, clearInBusiness, updateAuthStatus} from "../../store/authSlice";
import { clearListOfBusiness } from '../../store/listOfBusinessSlice';
import { useLocationContext } from '../../context/LocationContext';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'

const SignOutPrompt = ({ navigation }) => {
    const { getLocation,currentLocation } = useLocationContext();

    useFocusEffect(useCallback(()=>{
        getLocation("Sign Out")
    },[]))

    const dispatch = useDispatch();

    const handleSignOut = async () => {
        // Perform the sign-out action (e.g., clear storage, navigate to login screen)

        try {
            // await AsyncStorage.removeItem('authKey');
            await SecureStore.deleteItemAsync('authKey');
            dispatch(updateAuthStatus(false));
        } catch (e) {
        }
        try {
            // await AsyncStorage.removeItem('businessId');
            await SecureStore.deleteItemAsync('businessId');
            dispatch(updateAuthStatus(false));
        } catch (e) {}
        
        dispatch(clearInBusiness());
        dispatch(clearBusinessId());
        dispatch(clearListOfBusiness())

        Alert.alert("Signed out", "You have been signed out successfully.");
        // navigation.navigate("Checkout");
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
                <PrimaryButton label="No" onPress={() => navigation.goBack()} buttonStyle={{width: "40%"}}/>
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
