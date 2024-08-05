import {StyleSheet, View, Image, Text} from "react-native";
import Colors from "../../constants/Colors";

function SignInHeader() {
    return (
        <View style={styles.header}>
            {/* <View style={styles.logo}> */}
            <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logoImage}
            />
            <Text style={styles.headerText}>
                Beauty, Wellness and Fitness management platform
            </Text>
        </View>
    );
}

export default SignInHeader;

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.darkBlue,
        alignItems: "center",
        // borderWidth: 6,
        // borderColor: 'red'
    },
    logoImage: {
        width: 146,
        height: 28,
        marginTop: 40,
    },
    headerText: {
        color: Colors.grey400,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 16,
    },
});
