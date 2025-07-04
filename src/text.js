export function defaultValue(value, defaultValue) {
    if (value === null)
        return defaultValue;
    if (value === undefined)
        return defaultValue;
    if (isNaN(value))
        return defaultValue;
    if (value === '')
        return defaultValue;
    return value;
}

const DAY = 86_400;
const HOUR = 3_600;
const MINUTE = 60;

export function duration(value) {
    const totalSeconds = isNaN(+value) ? 0 : Math.floor(+value / 1000);
    let seconds = totalSeconds;
    let result = '';
    let interval = Math.floor(seconds / DAY);
    if (seconds >= DAY) {
        result += `${pad(interval, 1)} day${interval > 1 ? 's' : ''} `;
        seconds = seconds - (DAY * interval);
    }
    interval = Math.floor(seconds / HOUR);
    if (totalSeconds >= HOUR) {
        result += `${pad(interval, 2)}:`;
        seconds = seconds - (HOUR * interval);
    }
    interval = Math.floor(seconds / MINUTE);
    result += `${pad(interval, 2)}:`;
    seconds = seconds - (MINUTE * interval);
    interval = Math.floor(seconds);
    result += `${pad(interval, 2)}`;

    return result;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}