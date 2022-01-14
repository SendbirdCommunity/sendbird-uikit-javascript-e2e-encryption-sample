import React, {useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";
import {
    createVirgilGroup,
    getVirgilToken,
    loadVirgilGroup
} from "./e3";
import {
    Channel as SBConversation,
    ChannelList as SBChannelList,
    withSendBird
} from "sendbird-uikit";

import {CustomMessageInput} from "./CustomMessageInput.js";
import {EThree} from "@virgilsecurity/e3kit-browser";
import UserMessage from "./UserMessage";

function CustomizedApp(props) {
    const {stores: {sdkStore, userStore}} = props;
    const [e3, setE3] = useState({});
    const [currentChannelUrl, setCurrentChannelUrl] = useState("");

    useEffect(() => {

        (async () => {
            const eThree = await EThree.initialize(() => getVirgilToken(props.config.userId));
            setE3(eThree)
            try {
                // await eThree.unregister()
                await eThree.register()
            } catch (e) {
                console.warn("expected error:", e)
            }
        })()
    }, [])

    const getChannelParams = (channel_url, userIds) => {
        const params = new sdkStore.sdk.GroupChannelParams();
        params.addUserIds(userIds);
        params.name = "SOME NAME";
        params.channelUrl = channel_url;
        return params;
    }

    return (
        <div className="customized-app">
            <div className="sendbird-app__wrap">
                <div className="sendbird-app__channellist-wrap">
                    <SBChannelList
                        onBeforeCreateChannel={(userIds) => {
                            const channel_url = `virgil_sendbird_group_channel_${uuidv4()}`
                            createVirgilGroup(e3, channel_url, userIds)
                            return getChannelParams(channel_url, [userStore.user.userId, ...userIds]);
                        }}
                        onChannelSelect={(channel) => {
                            if (channel && channel.url) {
                                setCurrentChannelUrl(channel.url);
                                loadVirgilGroup(e3, channel);
                            }

                        }}
                    />
                </div>
                <div className="sendbird-app__conversation-wrap">
                    <SBConversation
                        renderChatItem={(props) => {
                            if (props.message.messageType === "user") {
                                return (<UserMessage
                                    message={props.message}
                                    userId={userStore.user.userId}
                                    e3={e3}
                                    channel={props.channel}
                                />)
                            } else {
                                return (<div></div>)
                            }
                        }
                        }
                        channelUrl={currentChannelUrl}
                        renderMessageInput={(channel) => (
                            <CustomMessageInput
                                channel={channel}
                                sdk={sdkStore.sdk}
                                e3={e3}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default withSendBird(CustomizedApp);
