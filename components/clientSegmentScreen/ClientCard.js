import {View, StyleSheet, Text} from "react-native";
import Colors from "../../constants/Colors"
const radius = 38;

export default function ClientCard(props) {
    const name = props.name !== undefined ? props.name.toString() : props.name;
    const phone = props.phone;
    const email = props.email;


    return (
        <View style={styles.card}>
            <View style={styles.innerContainer}>
                <View style={styles.clientProfile}>
                    <Text style={styles.text}>{name !== undefined ? name.at(0).toUpperCase() : "Z"}</Text>
                </View>

                <View style={styles.clientDetailsContainer}>
                    {
                        props.name !== undefined ? <Text style={styles.name}>{name}</Text> : null
                    }
                    {
                        props.phone !== undefined ? < Text style={styles.phone}>{phone}</Text> : null
                    }
                    {
                        email !== undefined && email !== null && email.trim().length !== 0 ? <Text style={styles.email}>{email}</Text>: null
                    }

                    {/*<Text>{name}</Text>*/}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 86,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey250,
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
        alignItems: "center"
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