// Description: This file contains the functions that interact with the Stability API
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

// Create an absolute path to the .env file located one directory above
const dotenvPath = path.join(__dirname, "../..", ".env");

// Load the environment variables from the .env file
dotenv.config({ path: dotenvPath });

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const textToImage = async (prompt) => {
	const apiUrl =
		"https://api.stability.ai/v1/generation/stable-diffusion-512-v2-1/text-to-image";

	const headers = {
		Accept: "application/json",
		Authorization: STABILITY_API_KEY, // Replace with your actual API key
	};

	const body = {
		steps: 10,
		width: 512,
		height: 512,
		seed: 0,
		cfg_scale: 5,
		samples: 1,
		text_prompts: [
			{
				text: prompt,
				weight: 1,
			},
			{
				text: "blurry, bad",
				weight: -1,
			},
		],
	};

	try {
		const response = await axios.post(apiUrl, body, {
			headers,
		});

		if (response.status !== 200) {
			throw new Error(`Non-200 response: ${response.status}`);
		}

		const responseJSON = response.data;
		console.log(response);
		console.log(responseJSON);
		const base64Images = responseJSON.artifacts.map((image) => image.base64);

		console.log(base64Images);
		return base64Images[0];
	} catch (error) {
		throw new Error(`Error generating image: ${error.message}`);
	}
};

module.exports = { textToImage };
