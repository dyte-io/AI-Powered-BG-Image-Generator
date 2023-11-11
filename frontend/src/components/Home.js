import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAIImage } from "../SharedDataContext";

function Home({ meetingId }) {
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const { updateAIImageUrl } = useAIImage();
	const navigate = useNavigate();

	const REACT_APP_SERVER_URL =
		process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

	const handleUpload = async () => {
		try {
			const response = await fetch(REACT_APP_SERVER_URL + "/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: prompt }),
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				updateAIImageUrl(data?.imgurLink);
				setLoading(false);
				navigate(`/meeting/${meetingId}`);
			} else {
				console.log("error" + response);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCreateMeeting = async () => {
		setLoading(true);
		try {
			updateAIImageUrl(prompt);
			handleUpload();
		} catch (error) {
			console.error("Error generating image:", error);
		}
	};

	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				fontSize: "x-large",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<h2
				style={{
					color: "#00000",
					fontWeight: "bold",
					fontSize: "1.5rem",
					marginBottom: "20px",
				}}
			>
				Enter AI prompt
			</h2>
			<input
				type="text"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				style={{
					paddingTop: "8px",
					paddingBottom: "8px",
					paddingLeft: "4px",
					paddingRight: "4px",
					border: "2px #2260FD solid",
					borderRadius: "4px",
					width: "300px",
					marginBottom: "20px",
				}}
			/>
			<button
				onClick={handleCreateMeeting}
				style={{
					backgroundColor: "#2260FD",
					color: "white",
					padding: "10px 20px",
					borderRadius: "4px",
					fontWeight: "bold",
					alignItems: "center",
					border: "none",
					cursor: "pointer",
					width: "310px",
					display: "flex",
					justifyContent: "center",
				}}
				disabled={loading}
			>
				{loading ? (
					<div className="spinner-border text-light" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				) : (
					"Create and join meeting"
				)}
			</button>
		</div>
	);
}

export default Home;
