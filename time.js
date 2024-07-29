//function for time stamp after posting //with the help of chatgpt: how to create time ago function in node.js
// Function to calculate and format time ago
function timePosted(timestamp) {
    //(Date.now() - new Date(timestamp)) / 1000: Calculates the difference in seconds between the current time and the timestamp from the database.
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000); //date.now() returns the current date and time in milliseconds
    //Math.floor() returns the largest integer less than or equal to a given number //new Date(timestamp) converts the database timestamp into a JavaScript Date object.

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago"; 
}
module.exports = {timePosted};