const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");

// Create an absolute path to the .env file located one directory above
const dotenvPath = path.join(__dirname, "../..", ".env");

// Load the environment variables from the .env file
dotenv.config({ path: dotenvPath });

const DYTE_API_KEY = process.env.DYTE_API_KEY;
const DYTE_ORG_ID = process.env.DYTE_ORG_ID;

console.log(DYTE_API_KEY, DYTE_ORG_ID);

const API_HASH = Buffer.from(
	`${DYTE_ORG_ID}:${DYTE_API_KEY}`,
	"utf-8"
).toString("base64");

console.log(API_HASH);
const DyteAPI = axios.create({
	baseURL: "https://api.dyte.io/v2",
	headers: {
		Authorization: `Basic ${API_HASH}`,
	},
});

module.exports = DyteAPI;
