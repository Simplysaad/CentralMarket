/** @format */

const pomodoro = (focus, rest) => {
    if (!focus) focus = 25 * 60 * 1000;
    if (!rest) rest = 5 * 60 * 1000;

    setInterval(function () {
        let date = new Date(Date.now());
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let milliSeconds = date.getMilliseconds();

        console.log(`${minutes}:${seconds}`);
    }, 60000);

    setInterval(function () {
        console.log("time to rest", "you can rest for five minutes");
        setTimeout(function () {
            console.log("rest completed", "five minutes up", "says pomodoro");
        }, rest);
    }, focus);
};
pomodoro();
