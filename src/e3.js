export const getVirgilToken = async (userId) => {
    try {
        const response = await fetch(`http://localhost:6789/virgil-jwt?user=${userId}`);
        const responseJson = await response.json();
        const { virgilToken } = responseJson;
        return virgilToken;
    } catch (e) {
        return null;
    }
};

export const createVirgilGroup = async (e3, channel_url, participantIdentities) => {
        const participants = await e3.findUsers(participantIdentities)
        return await e3.createGroup(channel_url, participants);
};

export const loadVirgilGroup = async (e3, channel) => {
        const channelCreatorASCardOwner = await e3.findUsers(channel.creator.userId);
        return await e3.loadGroup(channel.url, channelCreatorASCardOwner);
};

export const encryptMessage = async (e3, channel, message) => {
    try {
        const virgilGroup = await e3.getGroup(channel.channel.url)
        if(virgilGroup.error) {return console.error(virgilGroup.errorMessage)}
        return await virgilGroup.encrypt(message);
    } catch (e) {
        return {error: true, message: "Message encryption failed", errorMessage: e}
    }
};

export const decryptMessage = async (e3, message, channel) => {
    if(message.sender) {
        try {
            const checkUser = await e3.findUsers(message.sender.userId);
            const group = await e3.getGroup(channel.url)
            return await group.decrypt(message.message, checkUser);
        } catch (e) {
            return {error: true, message: "Message decrypt failed"}
        }
    } else {
         return  {error: true, message: "Message pending" }
    }
}












