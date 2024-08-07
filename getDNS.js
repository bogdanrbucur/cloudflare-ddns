import fs from "fs-extra";
const config = await fs.readJson("./config.json");
const apikey = config.CLOUDFLARE_API_KEY;
const zoneId = config.CLOUDFLARE_ZONE_ID;

(async function getDNS() {
	let url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

	let options = {
		method: "GET",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${apikey}` },
	};

	try {
		const res = await fetch(url, options);
		const resObj = await res.json();
		console.log(resObj);
	} catch (err) {
		console.log(`error: ${err}`);
	}
})();
