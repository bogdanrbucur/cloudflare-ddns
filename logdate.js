// Get today in YYYY.MM.DD.log
function logDate() {
	let logDate = new Date();
	return `${logDate.getFullYear()}.${String(logDate.getMonth() + 1).padStart(2, "0")}.${String(logDate.getDate()).padStart(2, "0")}.log`;
}

const logfile = logDate();

export default logfile;
