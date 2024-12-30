import AuthScreen from "../screens/AuthScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
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