import fs from "fs-extra";
import log from "log-to-file";
import logfile from "./logdate.js";

const config = await fs.readJson("./config.json");
const apikey = config.CLOUDFLARE_API_KEY;
const zoneId = config.CLOUDFLARE_ZONE_ID;
const accountId = config.CLOUDFLARE_ACCOUNT_ID;
const records = config.CLOUDFLARE_DNS_RECORDS;
const currentIP = await fs.readJson("./currentIP.json");

// If ./logs folder doesn't exist, create it
try {
	fs.ensureDirSync(`./logs`);
} catch (err) {
	console.error(err);
}

const newIp = await getPublicIP();

if (newIp !== currentIP) {
	await fs.writeJson("./currentIP.json", newIp);
	for (const record of records) await updateDNS(record, newIp);
} else {
	console.log("No change in IP address");
	log("No change in IP address", `./logs/${logfile}`);
}

async function getPublicIP() {
	const url = "http://api.ipify.org/?format=json";
	let options = {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	};

	try {
		const res = await fetch(url, options);
		const ipObject = await res.json();
		const newIp = ipObject.ip;
		console.log(`Fetched public IP: ${newIp}`);
		log(`Fetched public IP: ${newIp}`, `./logs/${logfile}`);
		return newIp;
	} catch (err) {
		console.error(err);
		log(err, `./logs/${logfile}`);
	}
}

async function updateDNS(record, newIp) {
	const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${record.id}`;
	let options = {
		method: "PATCH",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${apikey}` },
		body: `{"content":"${newIp}","name":"${record.domain}","proxied":false,"type":"A","comment":"DDNS update","id":"${accountId}"}`,
	};

	try {
		const res = await fetch(url, options);
		const resObj = await res.json();
		if (!resObj.success) {
			console.error(`Error updating DNS record ${record.domain}: ${resObj.errors[0].message}`);
			log(`Error updating DNS record ${record.domain}: ${resObj.errors[0].message}`, `./logs/${logfile}`);
			return;
		}
		console.log(`DNS record ${resObj.result.name} type ${resObj.result.type} updated to new target: ${resObj.result.content}`);
		log(`DNS record ${resObj.result.name} type ${resObj.result.type} updated to new target: ${resObj.result.content}`, `./logs/${logfile}`);
	} catch (err) {
		console.error("error:" + err);
		log("error:" + err, `./logs/${logfile}`);
	}
}
