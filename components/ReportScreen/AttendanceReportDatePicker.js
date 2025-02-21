import AppointmentsDatePicker from "../appointments/AppointmentsDatePicker";
import moment from "moment";
import React from "react";

const AttendanceReportDatePicker = (props) => {

    return (
        <AppointmentsDatePicker
            date={props.date}
            onRightArrowPress={() => {
                if (props.range === "day") {
                    props.setSelectedDate(prev =>
                        moment(prev).add(1, 'day').toDate()
                    );
                } else {
                    props.setSelectedDate(prev => {
                        console.log(props.date)
                        console.log(prev)
                        console.log(moment(prev).add(1, "month").toDate())
                        return moment(prev).add(1, "month").toDate()
                    })
                }
            }}
            onLeftArrowPress={() => {
                if (props.range === "day") {
                    props.setSelectedDate(prev =>
                        moment(prev).subtract(1, 'day').toDate()
                    );
                } else {
                    props.setSelectedDate(prev => {
                        console.log(props.date)
                        console.log(prev)
                        console.log(moment(prev).subtract(1, "month").toDate())
                        return moment(prev).subtract(1, "month").toDate()
                    })
                }
            }}
            range={props.range}
            displayText={props.range === "day"
                ? moment(props.date).format("DD MMM, YYYY")
                : moment(props.date).format("MMM YYYY")}
            containerStyle={{flex: 1, marginBottom: 20}}
        />
    );
}

export default AttendanceReportDatePicker;