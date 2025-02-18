import AuthScreen from "../screens/Auth/AuthScreen";
import ForgetPasswordScreen from "../screens/Auth/ForgetPasswordScreen";
import VerificationCodeScreen from "../screens/Auth/VerificationCodeScreen";
import ChangePasswordScreen from "../screens/Auth/ChangePasswordScreen";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const AuthNavigator = () => {
    const AuthStack = createNativeStackNavigator();

    return <AuthStack.Navigator screenOptions={{headerShown: false}}>
        <AuthStack.Screen name="AuthScreen" component={AuthScreen}/>
        <AuthStack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen}/>
        <AuthStack.Screen name="VerificationCodeScreen" component={VerificationCodeScreen}/>
        <AuthStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}/>
    </AuthStack.Navigator>
};

export default AuthNavigator;