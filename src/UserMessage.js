import React, {useEffect, useState} from "react";

import {
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Typography
} from "@material-ui/core";
import { decryptMessage } from "./e3";

export default function UserMessage(props) {
    // props
    const {message, channel, userId} = props;
    const [decryptedMessage, setDecryptedMessage] = useState("...")
    const [direction, setDirection] = useState("incoming")

    useEffect(() => {
        if (props.message.customType === "encrypted-user-message") {
            decryptMessage(props.e3, props.message, channel).then(result => {
                if (result.error) {
                    setDecryptedMessage("Decryption Failed")// console.log(result)
                } else {
                    setDecryptedMessage(result);
                }
            })
        } else {
            setDecryptedMessage(props.message.message)
        }
        if (message.sender && message.sender.userId === userId) {
            setDirection("outgoing");
        }
    }, [])

    return (
        <div className={`sendbird-message-hoc__message-content sendbird-message-content ${direction}`}>
            <Card
                className={`sendbird-message-content__middle__message-item-body sendbird-text-message-item-body ${direction}`}>
                <CardHeader
                    avatar={
                        message.sender ? (
                            <Avatar alt="Us" src={message.sender.profileUrl}/>
                        ) : (
                            <Avatar className="user-message__avatar">Us</Avatar>
                        )
                    }
                    title={
                        message.sender
                            ? message.sender.nickname || message.sender.userId
                            : "(No name)"
                    }
                />
                <CardContent>
                    <Typography variant="body1" component="p">
                        { decryptedMessage }
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
