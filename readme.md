# Cloudflare DDNS

JavaScript script to get a machine's public IP and update Cloudflare DNS records using Cloudflare API. Works on anything that can run Node.js.

## Prerequisites

[Node.js](https://nodejs.org/en/download/) v16 or later

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Rename `config.example.json` to `config.json`

## Configuration

1. Set your Cloudflare account email in `config.json`
2. Ger your Cloudflare **Zone ID** and **Account ID** from Cloudflare Dashboard -> Overview and set them in `config.json`
   ![alt text](image-2.png)
3. Click on **Get your API** token and view your **Global API Key** and set it in `config.json`
4. Run `node getDNS.js` to get the DNS id(s). You only need to run this twice. Configure all your domains with their IDs in `config.json` `CLOUDFLARE_DNS_RECORDS` array

## Scheduled run

### Linux

You can use a cron job to run the script at a specific interval. For example, to run the script every 10 minutes, add the following line to your crontab by running `crontab -e`:

```
*/10 * * * * /usr/bin/node /path/to/cloudflare-ddns/index.js
```

If it doesn't run, you probably need to add run permissions:

```
chmod +x /path/to/cloudflare-ddns/index.js
```

### Windows

You can use Task Scheduler to run the script at a specific interval. Create a new basic task with the following settings:

Program/script: "Powershell"
Add arguments (optional): `cd "C:\path\to\script\" | node index.js`
