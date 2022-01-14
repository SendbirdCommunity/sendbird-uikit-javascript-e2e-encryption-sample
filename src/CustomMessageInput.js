import React, {useEffect, useState} from "react";
import { useSendbirdStateContext, sendBirdSelectors } from "sendbird-uikit";
import {encryptMessage, loadVirgilGroup} from "./e3";


export const CustomMessageInput = (props) => {

    //Bring in Sendbird context and send message functionality.
    const context = useSendbirdStateContext();
    const sendMessage = sendBirdSelectors.getSendUserMessage(context)

    const [placeHolder, setPlaceHolder] = useState("Enter message");
    const [inputMessage, setInputMessage] = useState("")

    async function onSend () {

        const virgilGroup = await loadVirgilGroup(props.e3, props.channel.channel)
        if(virgilGroup.error) {return console.error(virgilGroup.errorMessage)}

        const encryptedMessage = await encryptMessage(props.e3, virgilGroup, inputMessage)
        if(virgilGroup.error) {return console.error(encryptedMessage.errorMessage)}

        const params = new props.sdk.UserMessageParams();
        params.message = encryptedMessage
        params.customType = "encrypted-user-message"

        sendMessage(props.channel.channel.url, params).then((message, error) => {
            setPlaceHolder("Enter Message");
            setInputMessage("");
        })
    }

    const handleChange = (e) =>  {
        setInputMessage(e.target.value)
        e.target.value === ""? setPlaceHolder("Enter message") : setPlaceHolder("");
    }

    return (
        <div>
            <div className="sendbird-message-input-wrapper" style={{width: "95%" ,margin: "0 auto"}}>
                <div className="sendbird-message-input ">
                    <textarea
                        value = {inputMessage}
                        onChange={handleChange}
                        className="sendbird-message-input--textarea"
                        name="sendbird-message-input"
                        maxLength="5000">
                    </textarea>
                    <span
                        className="sendbird-message-input--placeholder sendbird-label sendbird-label--body-1 sendbird-label--color-onbackground-3">{placeHolder}</span>
                    <button onClick={onSend} className="sendbird-message-input--attach sendbird-iconbutton "
                            style={{height: "32px", width: "32px"}}>
                        <span className="sendbird-iconbutton__inner">
                            <div
                                className=" sendbird-icon sendbird-icon-attach sendbird-icon-color--content-inverse"
                                role="button" tabIndex="0"
                                style={{width: "20px", minWidth: "20px", height: "20px", minHeight: "20px"}}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="1 3 20 18">
                                <path className="icon-attach_svg__fill"
                                      d="M3.4,20.4 L20.85,12.92 C21.66,12.57 21.66,11.43 20.85,11.08 L3.4,3.6 C2.74,3.31 2.01,3.8 2.01,4.51 L2,9.12 C2,9.62 2.37,10.05 2.87,10.11 L17,12 L2.87,13.88 C2.37,13.95 2,14.38 2,14.88 L2.01,19.49 C2.01,20.2 2.74,20.69 3.4,20.4 Z"
                                      fill="#000"
                                      fillRule="evenodd"></path>
                            </svg>
                            </div>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

