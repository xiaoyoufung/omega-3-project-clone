const date = new Date();

// Function to convert
// single digit input
// to two digits
const formatData =
    (input) => {
        if (input > 9) {
            return input;
        } else return `0${input}`;
    };

// Function to convert
// 24 Hour to 12 Hour clock
const formatHour =
    (input) => {
        if (input > 12) {
            return input - 12;
        }
        return input;
    };

// Data about date
const format = {
    dd: formatData(date.getDate()),
    mm: formatData(date.getMonth() + 1),
    yyyy: date.getFullYear(),
    HH: formatData(date.getHours()),
    hh: formatData(formatHour(date.getHours())),
    MM: formatData(date.getMinutes()),
    SS: formatData(date.getSeconds()),
};
const format24Hour = (
    {
        dd, mm, yyyy,
        HH, MM, SS
    }) => {
    console.log(
        `${mm}/${dd}/${yyyy} 
        ${HH}:${MM}:${SS}`
    );
};
const format12Hour =
    (
        {
            dd, mm,
            yyyy, hh,
            MM, SS
        }
    ) => {
        console.log(
            `${mm}/${dd}/${yyyy} 
            ${hh}:${MM}:${SS}`
        );
    };

// Time in 24 Hour format
format24Hour(format);
// Time in 12 Hour format
format12Hour(format);