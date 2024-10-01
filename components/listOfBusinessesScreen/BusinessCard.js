import {View, Text, StyleSheet, Image, Pressable, ToastAndroid} from 'react-native';
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";

export default function BusinessCard(props) {
    const [status, setStatus] = useState("");

    useEffect(() => {
        let status = props.status;
        if (status === "test") {
            setStatus("TEST BUSINESS")
        } else if (status === "unverified") {
            setStatus("UNVERIFIED")
        } else if (status === "verified") {
            setStatus("VERIFIED");
        }
    }, []);


    const styles = StyleSheet.create({
        businessCard: {
            borderWidth: 1,
            borderColor: Colors.grey250,
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
        },
        profileImage: {
            // objectFit: "cover",
            borderRadius: 8,
            alignItems: "center",
        },
        innerContainer: {
            padding: 8,
            flexShrink: 1,
            marginLeft: 8,
            gap: 1,
            width: '100%'
        },
        profileImageContainer: {
            justifyContent: "center",
            overflow: 'hidden',
            borderRadius: 8,
            // borderWidth: 1,
        },
        buttonStyle: {
            marginVertical: 12,
            backgroundColor: props.status !== "verified" ? Colors.transparent : Colors.green,
            borderWidth: 1,
            borderColor: props.status === "verified" ? Colors.white : props.status === "unverified" ? Colors.error : Colors.highlight,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 10,
            color: props.status === "verified" ? Colors.white : props.status === "unverified" ? Colors.error : Colors.highlight,
            textAlign: "center",
            fontWeight: "bold",
            maxWidth: 200
        },
    })


    return (
        <Pressable
            style={styles.businessCard}
            android_ripple={{color: Colors.grey250}}
            onPress={() => {
                if (props.status === "unverified") {
                    // ToastAndroid.show("Business yet to be verified", ToastAndroid.SHORT);
                    //TODO

                    // Toast.show("Business yet to be verified",{
                    //     duration:Toast.durations.SHORT,
                    //     position: Toast.positions.BOTTOM,
                    //     shadow:false,
                    //     backgroundColor:"black",
                    //     opacity:1
                    // })
                    return
                }
                props.onPress();
            }}
        >
            <View style={styles.profileImageContainer}>
                <Image
                    source={{
                        uri: props.imageURL === null ?
                            "https://5.imimg.com/data5/SELLER/Default/2023/4/301028890/FI/HM/UA/5050159/saloon-interior-design-500x500.jpg" :
                            props.imageURL
                    }}
                    height={80}
                    width={130}
                    style={styles.profileImage}
                    resizeMode={"contain"}
                />
            </View>

            <View style={styles.innerContainer}>
                <Text style={[textTheme.titleSmall]}>
                    {props.name}
                </Text>
                <Text style={[textTheme.bodyMedium]}>
                    {props.area}
                </Text>
                <Text style={[textTheme.bodyMedium]}>
                    {props.address}
                </Text>
                <Text style={props.status === "verified" ? [styles.buttonStyle,{overflow:"hidden"}] : styles.buttonStyle}>
                    {status}
                </Text>
            </View>
        </Pressable>
    );
}

