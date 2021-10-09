import React from "react";
import {Row, Col} from "react-bootstrap";

export default function Users({user}) {
	return (
		<div className="chat-list-item">
			{" "}
			<Row>
				<Col sm={2}>
					<img
						src={user.profile.avatar}
						alt="avatar"
						className="avatar-chat"
						style={{height: "50px", width: "50px", borderRadius: "50%"}}
					/>{" "}
				</Col>
				<Col sm={8}>
					<div className="chat-item-contact">
						{user.profile.firstName}
						{"  "}
						{user.profile.lastName}
					</div>
				</Col>
			</Row>
		</div>
	);
}
