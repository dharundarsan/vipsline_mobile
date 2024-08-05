import React, {useRef, useState} from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from "../../constants/Colors";


export default function OtpInputBox({style}) {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);

    const [isBoxOneFocussed, setIsBoxOneFocussed] = useState(true);
    const [isBoxTwoFocussed, setIsBoxTwoFocussed] = useState(false);
    const [isBoxThreeFocussed, setIsBoxThreeFocussed] = useState(false);
    const [isBoxFourFocussed, setIsBoxFourFocussed] = useState(false);

    const [box1, setBox1] = useState(false);
    const [box2, setBox2] = useState(false);
    const [box3, setBox3] = useState(false);
    const [box4, setBox4] = useState(false);

    return(
        <View style={[styles.otpInput, style]}>
            <TextInput
                placeholder="*"
                placeholderTextColor={Colors.grey800}
                style={[
                        styles.otpBox,
                        {borderColor: isBoxOneFocussed ? Colors.highlight :  box1 ? Colors.green :  Colors.grey400}
                ]}
                maxLength={1}
                ref={ref1}
                keyboardType='number-pad'
                onChangeText={text => {
                    if(text.length >= 1) {
                        ref2.current.focus();
                        setBox1(true);
                        setIsBoxOneFocussed(false);
                    }
                    else if(text.length < 1) {
                        setIsBoxOneFocussed(true);
                        setBox1(false);
                    }
                }}
                onFocus={() => {
                    setIsBoxTwoFocussed(false)
                    setIsBoxThreeFocussed(false);
                    setIsBoxFourFocussed(false);
                    setIsBoxOneFocussed(true);
                }}

            />
            <TextInput
                placeholder="*"
                style={[
                    styles.otpBox,
                    {borderColor: isBoxTwoFocussed ? Colors.highlight :  box2 ? Colors.green :  Colors.grey400}
                ]}
                maxLength={1}
                ref={ref2}
                keyboardType='number-pad'
                onChangeText={text => {
                    if(text.length >= 1) {
                        ref3.current.focus();
                        setBox2(true);
                        setIsBoxTwoFocussed(false);
                    }
                    else if(text.length < 1) {
                        ref1.current.focus();
                        setIsBoxTwoFocussed(false);
                        setBox2(false);
                    }
                }}
                onFocus={() => {
                    setIsBoxTwoFocussed(true)
                    setIsBoxThreeFocussed(false);
                    setIsBoxFourFocussed(false);
                    setIsBoxOneFocussed(false);
                }}
            />
            <TextInput
                placeholder="*"
                style={[
                    styles.otpBox,
                    {borderColor: isBoxThreeFocussed ? Colors.highlight :  box3 ? Colors.green :  Colors.grey400}
                ]}
                maxLength={1}
                ref={ref3}
                keyboardType='number-pad'
                onChangeText={text => {
                    if(text.length >= 1) {
                        ref4.current.focus();
                        setBox3(true);
                        setIsBoxThreeFocussed(false);
                    }
                    else if(text.length < 1) {
                        ref2.current.focus();
                        setIsBoxThreeFocussed(false);
                        setBox3(false);
                    }
                }}
                onFocus={() => {
                    setIsBoxTwoFocussed(false)
                    setIsBoxThreeFocussed(true);
                    setIsBoxFourFocussed(false);
                    setIsBoxOneFocussed(false);
                }}
            />
            <TextInput
                placeholder="*"
                style={[
                    styles.otpBox,
                    {borderColor: isBoxFourFocussed ? Colors.highlight :  box4 ? Colors.green :  Colors.grey400}
                ]}
                maxLength={1}
                ref={ref4}
                keyboardType='number-pad'
                onChangeText={text => {
                    if(text.length < 1) {
                        ref3.current.focus();
                        setIsBoxFourFocussed(false);
                        setBox4(false);
                    }
                    else if(text.length === 1) {
                        setBox4(true);
                        setIsBoxFourFocussed(false);
                    }
                }}
                onFocus={() => {
                    setIsBoxTwoFocussed(false)
                    setIsBoxThreeFocussed(false);
                    setIsBoxFourFocussed(true);
                    setIsBoxOneFocussed(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    otpInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 2,
        gap: 16,
        height: 70
    },
    otpBox: {
        borderWidth: 1.5,
        borderRadius: 6,
        width: 57,
        padding: 8,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 20,
    }
});



