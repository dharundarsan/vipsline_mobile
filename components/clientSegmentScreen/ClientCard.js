import {View, StyleSheet, Text, Pressable} from "react-native";
import Colors from "../../constants/Colors"
import Divider from "../../ui/Divider";

const radius = 38;

export default function ClientCard(props) {
    const name = props.name !== undefined ? props.name.toString() : props.name;
    const phone = props.phone;
    const email = props.email;


    return (<>
            <Pressable
                style={[styles.card, props.card]}
                android_ripple={{color: props.rippleColor ? props.rippleColor : Colors.ripple}}
                onPress={() => {
                    props.onPress(props.clientId)
                }}
            >
                <View style={[styles.innerContainer, props.cardInnerContainer]}>
                    <View style={[styles.clientProfile, props.clientProfile]}>
                        <Text
                            style={[styles.text, props.avatarText]}>
                            {name !== undefined ? name.at(0).toUpperCase() : "Z"}
                        </Text>
                    </View>

                    <View style={[styles.clientDetailsContainer, props.clientDetailsContainer]}>
                        {
                            props.name !== undefined ? <Text style={[styles.name, props.nameText]}>{name}</Text> : null
                        }
                        {
                            props.phone !== undefined ?
                                < Text style={[styles.phone, props.phoneText]}>{phone}</Text> : null
                        }
                        {
                            email !== undefined && email !== null && email.trim().length !== 0 ?
                                <Text style={styles.email}>{email}</Text> : null
                        }

                        {/*<Text>{name}</Text>*/}
                    </View>
                </View>
            </Pressable>
            {
                props.divider ?
                    <Divider/> :
                    null
            }

        </>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    clientProfile: {
        borderRadius: radius,
        width: radius,
        height: radius,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightGreen
    },
    text: {
        fontWeight: '600',
        color: Colors.highlight
    },
    innerContainer: {
        marginLeft: 16,
        flexDirection: 'row',
        alignItems: "center",
    },
    clientDetailsContainer: {
        marginLeft: 16,
    },
    name: {
        fontWeight: '600',

    },
    phone: {
        color: Colors.grey650
    },
    email: {
        color: Colors.grey650
    },
})