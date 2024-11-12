// src/components/WelcomeBot.js
import React from "react";

const SlackMessage = ({ pfp, name, message }) => {
	const pfpLocation = require(`@site/static/${pfp}`).default;

	return (
		<div>
			<div
				style={{
					display: "flex",
					borderTop: "2px solid",
					paddingTop: "1rem",
					borderBottom: "2px solid",
				}}
			>
				<img
					style={{
						height: "3rem",
						width: "3rem",
						borderRadius: "10px",
						marginTop: "5px",
					}}
					src={pfpLocation}
					alt="Bot avatar"
				/>
				<div style={{ margin: "0 10px", wordWrap: "break-word" }}>
					<span style={{ fontWeight: 900 }}>{name}</span>
					<span style={{ color: "#444", marginLeft: "5px", fontSize: "12px" }}>
						1:00 AM
					</span>
					<p style={{ marginTop: "5px" }}>{message}</p>
				</div>
			</div>
			<br />
		</div>
	);
};

export default SlackMessage;
