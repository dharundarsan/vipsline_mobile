import moment from "moment";
import servicesList from "../components/checkoutScreen/ServicesList";

export const durationToMinutes = (duration) => {
    let parts = duration.split(" ");
    parts = parts.filter(p => p !== "");
    let totalMinutes = 0;
    if (parts.length > 2) {
        totalMinutes += parseInt(parts[0]) * 60; // Add hours as minutes
        totalMinutes += parseInt(parts[2]); // Add minutes
    } else {
        console.log("hour")
        console.log(parseInt(parts[0]))
        console.log(parseInt(parts[0]) * 60)
        console.log(parts[1].toString())
        if (parts[1].toString() === "h") {
            totalMinutes += parseInt(parts[0]) * 60; // Add minutes only
        } else {
            totalMinutes += parseInt(parts[0]); // Add minutes only
        }
    }

    return totalMinutes
}

export const formatDuration = (duration) => {
    const parts = duration.split(" ")
    let dur = duration;
    if (parts.length > 2) {
        if (parts[2].toString() === "0")
            dur = parts[0].toString() + " " + "h";
        else if (parts[0].toString() === "0")
            dur = parts[2].toString() + " " + "mins";
    }

    return dur;
}

export const sortAppointments = (serviceList) => {
    return serviceList.sort((a, b) =>
        moment(a.currentStartTime, "hh:mm A").diff(moment(b.currentStartTime, "hh:mm A"))
    );
};

export const adjustServicesTimings = (serviceList) => {
    console.log("adjustserviceList")
    console.log(serviceList)
    return serviceList.map((service, index) => {
        if (index === 0) {
            console.log("service.end_time")
            console.log(service.end_time)
            service.end_time = moment(service.preferred_date, "hh:mm A")
                .add(durationToMinutes(service.preferred_duration.label), "minute")
                .format("hh:mm A");
            console.log("service.end_time")
            console.log(service.end_time)
        } else {
            service.preferred_date = serviceList[index - 1].end_time;

            service.end_time = moment(service.preferred_date, "hh:mm A")
                .add(durationToMinutes(service.preferred_duration.label), "minutes")
                .format("hh:mm A");
        }

        return service;
    });
};

export const getAppointmentWithOldestStartTime = (servicesList) => {
    if (!servicesList.length) return null;

    const found = servicesList.reduce((oldest, service) => {
        return moment(service.currentStartTime, "hh:mm A").isBefore(
            moment(oldest.currentStartTime, "hh:mm A")
        )
            ? service
            : oldest;
    }, servicesList[0]);

    console.log("found")
    console.log(found)

    return found;
};

export const getStatusColorAndText = (status) => {
    if (status === "COMPLETED") {
        return {color: "#8bd0fe", text: "Completed"}
    } else if (status === "BOOKED") {
        return {color: "#9DDDE0", text: "Booked"}
    } else if (status === "CONFIRMED") {
        return {color: "#fce171", text: "Confirmed"}
    } else if (status === "ARRIVED") {
        return {color: "#e4a4fe", text: "Arrived"}
    } else if (status === "NO_SHOW") {
        return {color: "#e7766d", text: "No Show"}
    } else if (status === "IN_SERVICE") {
        return {color: "#88f1a7", text: "In Service"}
    } else if (status === "CANCELLED") {
        return {color: "#d0403c", text: "Cancelled"}
    }
}