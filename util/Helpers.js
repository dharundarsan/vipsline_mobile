export const capitalizeFirstLetter = (string) => {
    if (string === undefined) return;
    return string[0].toUpperCase() + string.slice(1, string.length);
}


export const formatDate = (date, format) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const padZero = (num) => num.toString().padStart(2, '0')

    switch (format) {
        case "yyyy-mm-dd":
            return `${year}-${padZero(month + 1)}-${padZero(day)}`;
        case "yyyy/mm/dd":
            return `${year}/${padZero(month + 1)}/${padZero(day)}`;
        case "yyyy-month-dd":
            return `${year}-${months[month]}-${padZero(day)}`;
        case "dd-month-yyyy":
            return `${padZero(day)}-${months[month]}-${year}`;
        case "dd-mm-yyyy":
            return `${padZero(day)}-${padZero(month + 1)}-${year}`
        case "yyyy-dd-mm":
            return `${year}-${padZero(day)}-${padZero(month + 1)}`
        case "d month yyyy":
            return `${day} ${months[month]} ${year}`;
        default:
            return `${day} ${months[month]} ${year}`;
    }
}


export function dateFormatter(date, monthType) {
    if(date === undefined) return;
    date = new Date(date);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: monthType,
        year: 'numeric'
    });
}




