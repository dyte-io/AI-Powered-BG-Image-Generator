import { useEffect, useState } from "react";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Stage from "./components/Stage";
import { AIImageProvider } from "./SharedDataContext";

const REACT_APP_SERVER_URL =
	process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

function App() {
	const [meetingId, setMeetingId] = useState();

	const createMeeting = async () => {
		try {
			const res = await fetch(`${REACT_APP_SERVER_URL}/meetings`, {
				method: "POST",
				body: JSON.stringify({ title: "AI generated image background" }),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				throw new Error("Failed to create meeting"); // You can customize the error message
			}

			const resJson = await res.json();
			window.localStorage.setItem("adminId", resJson.admin_id);
			setMeetingId(resJson.data.id);
		} catch (error) {
			console.error("Error creating meeting:", error);
		}
	};

	useEffect(() => {
		window.localStorage.removeItem("refImgUrl");
		const id = window.location.pathname.split("/")[2];
		if (!!!id) {
			createMeeting();
		}
	}, []);

	return (
		<AIImageProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home meetingId={meetingId} />}></Route>
					<Route path="/meeting/:meetingId" element={<Stage />}></Route>
				</Routes>
			</BrowserRouter>
		</AIImageProvider>
	);
}

export default App;
