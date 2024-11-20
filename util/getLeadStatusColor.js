import Colors from "../constants/Colors";

const getLeadStatusColor = (status) => {
    if (status === "New") return {background: "#6950F31A", text: Colors.highlight}
    if (status === "Follow up") return {background: "#F7941D1A", text: Colors.orange}
    if (status === "Prospective") return {background: "#EF5DA81A", text: "#EF5DA8"}
    if (status === "Sales opportunity") return {background: "#0352321A", text: "#035232"}
    if (status === "Converted") return {background: "#22B3781A", text: "#22B378"}
    if (status === "Not interested") return {background: "#D1373F1A", text: "#D1373F"}
    if (status === "Unqualified") return {background: "#1019281A", text: "#10192899"}
}

export default getLeadStatusColor;