// import React, {useRef, useState} from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';
// import Colors from "../../constants/Colors";
//
//
// export default function OtpInputBox(props) {
//     const ref1 = useRef(null);
//     const ref2 = useRef(null);
//     const ref3 = useRef(null);
//     const ref4 = useRef(null);
//
//     const [isBoxOneFocussed, setIsBoxOneFocussed] = useState(true);
//     const [isBoxTwoFocussed, setIsBoxTwoFocussed] = useState(false);
//     const [isBoxThreeFocussed, setIsBoxThreeFocussed] = useState(false);
//     const [isBoxFourFocussed, setIsBoxFourFocussed] = useState(false);
//
//     const [box1, setBox1] = useState(false);
//     const [box2, setBox2] = useState(false);
//     const [box3, setBox3] = useState(false);
//     const [box4, setBox4] = useState(false);
//
//     const [otp1, setOtp1] = useState("");
//     const [otp2, setOtp2] = useState("");
//     const [otp3, setOtp3] = useState("");
//     const [otp4, setOtp4] = useState("");
//
//     const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
//
//     return(
//         <View style={[styles.otpInput, props.style]}>
//             <TextInput
//                 placeholder="*"
//                 placeholderTextColor={Colors.grey800}
//                 style={[
//                         styles.otpBox,
//                         {borderColor: isBoxOneFocussed ? Colors.highlight :  box1 ? Colors.green :  Colors.grey400}
//                 ]}
//                 maxLength={1}
//                 ref={ref1}
//                 keyboardType='number-pad'
//                 onChangeText={text => {
//                     if(text.length >= 1) {
//                         ref2.current.focus();
//                         setBox1(true);
//                         setIsBoxOneFocussed(false);
//                     }
//                     else if(text.length < 1) {
//                         setIsBoxOneFocussed(true);
//                         setBox1(false);
//                     }
//                     setOtp1(text);
//                 }}
//                 onFocus={() => {
//                     setIsBoxTwoFocussed(false)
//                     setIsBoxThreeFocussed(false);
//                     setIsBoxFourFocussed(false);
//                     setIsBoxOneFocussed(true);
//                 }}
//                 value={otp1}
//                 onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection)}
//                 selection={cursorPosition}
//
//             />
//             <TextInput
//                 placeholder="*"
//                 style={[
//                     styles.otpBox,
//                     {borderColor: isBoxTwoFocussed ? Colors.highlight :  box2 ? Colors.green :  Colors.grey400}
//                 ]}
//                 maxLength={1}
//                 ref={ref2}
//                 keyboardType='number-pad'
//                 onChangeText={text => {
//                     if(text.length >= 1) {
//                         ref3.current.focus();
//                         setBox2(true);
//                         setIsBoxTwoFocussed(false);
//                     }
//                     else if(text.length < 1) {
//                         ref1.current.focus();
//                         setIsBoxTwoFocussed(false);
//                         setBox2(false);
//                     }
//                     setOtp2(text);
//                 }}
//                 onFocus={() => {
//                     setIsBoxTwoFocussed(true)
//                     setIsBoxThreeFocussed(false);
//                     setIsBoxFourFocussed(false);
//                     setIsBoxOneFocussed(false);
//                 }}
//                 value={otp2}
//             />
//             <TextInput
//                 placeholder="*"
//                 style={[
//                     styles.otpBox,
//                     {borderColor: isBoxThreeFocussed ? Colors.highlight :  box3 ? Colors.green :  Colors.grey400}
//                 ]}
//                 maxLength={1}
//                 ref={ref3}
//                 keyboardType='number-pad'
//                 onChangeText={text => {
//                     if(text.length >= 1) {
//                         ref4.current.focus();
//                         setBox3(true);
//                         setIsBoxThreeFocussed(false);
//                     }
//                     else if(text.length < 1) {
//                         ref2.current.focus();
//                         setIsBoxThreeFocussed(false);
//                         setBox3(false);
//                     }
//                     setOtp3(text);
//                 }}
//                 onFocus={() => {
//                     setIsBoxTwoFocussed(false)
//                     setIsBoxThreeFocussed(true);
//                     setIsBoxFourFocussed(false);
//                     setIsBoxOneFocussed(false);
//                 }}
//                 value={otp3}
//                 selection={{ start: otp1.length, end: otp1.length }}
//             />
//             <TextInput
//                 placeholder="*"
//                 style={[
//                     styles.otpBox,
//                     {borderColor: isBoxFourFocussed ? Colors.highlight :  box4 ? Colors.green :  Colors.grey400}
//                 ]}
//                 maxLength={1}
//                 ref={ref4}
//                 keyboardType='number-pad'
//                 onChangeText={text => {
//                     if(text.length < 1) {
//                         ref3.current.focus();
//                         setIsBoxFourFocussed(false);
//                         setBox4(false);
//                     }
//                     else if(text.length === 1) {
//                         setBox4(true);
//                         setIsBoxFourFocussed(false);
//                     }
//                     setOtp4(text)
//                     props.otp(otp1 + otp2 + otp3 + text);
//
//                 }}
//                 onFocus={() => {
//                     setIsBoxTwoFocussed(false)
//                     setIsBoxThreeFocussed(false);
//                     setIsBoxFourFocussed(true);
//                     setIsBoxOneFocussed(false);
//                 }}
//                 value={otp4}
//             />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     otpInput: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         gap: 16,
//         height: 70,
//     },
//     otpBox: {
//         borderWidth: 1.5,
//         borderRadius: 6,
//         width: 57,
//         textAlign: 'center',
//     }
// });
//
//
//


import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from "../../constants/Colors";
import {useSelector} from "react-redux";
import {checkNullUndefined} from "../../util/Helpers";
import textTheme from "../../constants/TextTheme";

export default function OtpInputBox(props) {
    const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const isAuthenticated = useSelector((state) => state.authDetails.isAuthenticated);

    const [state, setState] = useState({
        focusedIndex: 0,
        otp: ['', '', '', ''],
        filled: [false, false, false, false],
    });



    const handleOtpChange = (text, index) => {
        const newOtp = [...state.otp];
        const newFilled = [...state.filled];

        // Update otp and filled states
        newOtp[index] = text;
        newFilled[index] = text.length > 0;

        // Automatically focus on next input if not empty, or previous input if empty
        if (text.length >= 1 && index < refs.length - 1) {
            refs[index + 1].current.focus();
        } else if (text.length === 0 && index > 0) {
            refs[index - 1].current.focus();
        }

        setState(prevState => ({
            ...prevState,
            otp: newOtp,
            filled: newFilled,
            focusedIndex: index,
        }));

        if (index === 3) {
            props.otp(newOtp.join(''));

        }
    };

    const handleFocus = (index) => {
        setState(prevState => ({
            ...prevState,
            focusedIndex: index,
        }));
    };



    function clearOTP() {
        setState(prevState => ({
            ...prevState,
            otp: ["", "", "", ""],
        }));
    }

    return (
        <View style={[styles.otpInput, props.style]}>
            {refs.map((ref, index) => {
                const newOtp = [...state.otp].join('');
                const isFocused = state.focusedIndex === index;
                const isFilled = state.filled[index];
                const borderColor = props.changing >=1 && !props.verify
                    ? Colors.error
                    : isFocused
                        ? Colors.highlight
                        : isFilled
                            ? Colors.green
                            : Colors.grey400;


                return (
                    <TextInput
                        key={index}
                        placeholder="*"
                        placeholderTextColor={Colors.grey800}
                        style={[
                            styles.otpBox,
                            { borderColor },
                            textTheme.bodyMedium
                        ]}
                        maxLength={1}
                        ref={ref}
                        keyboardType='number-pad'
                        onChangeText={text => {
                            handleOtpChange(text, index);
                            props.setChanging(prevState => prevState + 1);
                        }}
                        onFocus={() => handleFocus(index)}
                        value={state.otp[index]}
                        cursorColor={Colors.highlight}

                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    otpInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        height: 70,
    },
    otpBox: {
        borderWidth: 1.5,
        borderRadius: 6,
        width: 57,
        textAlign: 'center'
    }
});

