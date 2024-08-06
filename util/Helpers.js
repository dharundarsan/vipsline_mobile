export const capitalizeFirstLetter = (string) => {
    return string[0].toUpperCase() + string.slice(1, string.length);
}


export const formatDate = (date) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return new Date(date).getDate() +
    " " +
    months[new Date(date).getMonth()] +
    " " +
    new Date(date).getFullYear();

}