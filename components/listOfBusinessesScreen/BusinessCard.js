import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";

export default function BusinessCard(props) {
    const [status, setStatus] = useState("");

    useEffect(() => {
        let status = props.status;
        if(status === "test") {
            setStatus("TEST BUSINESS")
        }
        else if(status === "unverified") {
            setStatus("UNVERIFIED")
        }
        else if(status === "verified") {
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
            paddingLeft: 8,
            flexShrink: 1,
            marginLeft: 8,
            gap: 1,
        },
        profileImageContainer: {
            justifyContent:"center",
            overflow: 'hidden',
            borderRadius: 8,
            // borderWidth: 1,
        },
        buttonStyle: {
            alignSelf: "flex-start",
            marginVertical: 12,
            backgroundColor: props.status !== "verified" ? Colors.white : Colors.green,
            borderWidth: 1,
            borderColor: props.status === "verified" ? Colors.white : props.status === "unverified" ? Colors.error : Colors.highlight,


        },
        pressableStyle: {
            paddingVertical: 6,

        },
        buttonText: {
            color: props.status === "verified" ? Colors.white : props.status === "unverified" ? Colors.error : Colors.highlight,
        }
    })


    return (
        <Pressable
            style={styles.businessCard}
            android_ripple={{color: Colors.grey250}}
            onPress={props.onPress}
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
                </Text >

                <PrimaryButton
                    label={status}
                    buttonStyle={styles.buttonStyle}
                    pressableStyle={styles.pressableStyle}
                    textStyle={styles.buttonText}
                />
            </View>
        </Pressable>
    );
}

