const express = require("express");
const cors = require("cors");
const DyteAPI = require("./api/dyte");
const axios = require("axios");
const bodyParser = require("body-parser");
const { textToImage } = require("./api/stability"); // Update the path accordingly

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/meetings", async (req, res) => {
	const { title } = req.body;
	const response = await DyteAPI.post("/meetings", {
		title,
	});
	return res.status(response.status).json(response.data);
});

app.post("/meetings/:meetingId/participants", async (req, res) => {
	const meetingId = req.params.meetingId;
	const { name, preset_name } = req.body;
	const client_specific_id = `react-samples::${name.replaceAll(
		" ",
		"-"
	)}-${Math.random().toString(36).substring(2, 7)}`;
	const response = await DyteAPI.post(`/meetings/${meetingId}/participants`, {
		name,
		preset_name,
		client_specific_id,
	});

	return res.status(response.status).json(response.data);
});

app.post("/upload", async (req, res) => {
	try {
		const { prompt } = req.body;
		console.log(prompt);

		const generatedImageBase64 = await textToImage(prompt);

		// Upload the generated image to Imgur
		const imgurClientId = process.env.IMGUR_CLIENT_ID;

		const response = await axios.post(
			"https://api.imgur.com/3/image",
			{
				image: generatedImageBase64,
			},
			{
				headers: {
					Authorization: `Client-ID ${imgurClientId}`,
					"Content-Type": "application/json",
				},
			}
		);

		const imgurLink = response.data.data.link;
		return res.status(200).json({ imgurLink });
	} catch (error) {
		console.error("Error uploading image:", error.message);
		if (error.response) {
			console.error("Imgur API response:", error.response.data);
		}
		return res.status(500).json({ error: "Could not upload image." });
	}
});

app.listen(PORT, () => {
	console.log(`Started listening on ${PORT}...`);
});
