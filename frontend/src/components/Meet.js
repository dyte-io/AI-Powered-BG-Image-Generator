import { useState, useEffect, useRef } from "react";
import { DyteMeeting, provideDyteDesignSystem } from "@dytesdk/react-ui-kit";
import { useDyteClient } from "@dytesdk/react-web-core";
import DyteVideoBackgroundTransformer from "@dytesdk/video-background-transformer";
import { useAIImage } from "../SharedDataContext";

// Constants

const REACT_APP_SERVER_URL =
	process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

const Meet = () => {
	const meetingEl = useRef();
	const [meeting, initMeeting] = useDyteClient();
	const [userToken, setUserToken] = useState();
	const [hasInitializedBackground, setHasInitializedBackground] =
		useState(false);

	const { AIImageUrl } = useAIImage();

	const meetingId = window.location.pathname.split("/")[2];

	const initializeVideoBackground = async () => {
		try {
			if (!meeting) {
				return; // No need to proceed if the meeting is not available
			}

			const videoBackgroundTransformer =
				await DyteVideoBackgroundTransformer.init();
			const videoMiddleware =
				await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
					AIImageUrl
				);

			meeting.self.addVideoMiddleware(videoMiddleware);
			console.log("Video background initialized");
		} catch (error) {
			console.error("Error initializing video background:", error);
		}
	};

	const joinMeeting = async (id) => {
		try {
			const res = await fetch(
				`${REACT_APP_SERVER_URL}/meetings/${id}/participants`,
				{
					method: "POST",
					body: JSON.stringify({
						name: "new user",
						preset_name: "MyNewPreset",
						meeting_id: meetingId,
					}),
					headers: { "Content-Type": "application/json" },
				}
			);

			if (!res.ok) {
				throw new Error("Failed to join meeting"); // Customize the error message
			}

			const resJson = await res.json();
			return resJson.data.token;
		} catch (error) {
			console.error("Error joining meeting:", error.message);
		}
	};

	const joinMeetingId = async () => {
		if (meetingId) {
			const authToken = await joinMeeting(meetingId);
			await initMeeting({
				authToken,
			});
			setUserToken(authToken);
		}
	};

	useEffect(() => {
		if (meetingId && !userToken) joinMeetingId();
	}, []);

	useEffect(() => {
		if (meeting && !hasInitializedBackground) {
			initializeVideoBackground();
			setHasInitializedBackground(true);
		}
	}, [meeting, hasInitializedBackground]);

	useEffect(() => {
		if (userToken) {
			provideDyteDesignSystem(meetingEl.current, {
				theme: "dark",
			});
		}
	}, [userToken]);

	return (
		<div style={{ height: "100vh", width: "100vw", display: "flex" }}>
			{userToken && (
				<>
					<div style={{ width: "100vw", height: "100vh" }}>
						<DyteMeeting mode="fill" meeting={meeting} ref={meetingEl} />
					</div>
				</>
			)}
		</div>
	);
};

export default Meet;
