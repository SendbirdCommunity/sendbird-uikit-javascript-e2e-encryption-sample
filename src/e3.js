export const getVirgilToken = async (userId) => {
    try {
        const response = await fetch(`http://localhost:6789/virgil-jwt?user=${userId}`);
        const responseJson = await response.json();
        const {virgilToken} = responseJson;
        return virgilToken;
    } catch (e) {
        return null;
    }
};

export const createVirgilGroup = async (e3, channel_url, participantIdentities) => {
    console.log(participantIdentities)
    try {
        const participants = await e3.findUsers(participantIdentities)
        const group = await e3.createGroup(channel_url, participants);
        return {error: false, message: "Virgil Group created", data: group}
    } catch (e) {
        if (e.identities) {
            return {
                error: true,
                message: `Can't find Virgil registrations for these users:`,
                data: JSON.stringify(e.identities)
            }
        } else {
            return {error: true, message: "New Virgil Group not created", data: e}
        }
    }
};

export const loadVirgilGroup = async (e3, channel) => {
    try {
        const channelCreatorASCardOwner = await e3.findUsers(channel.creator.userId);
        return await e3.loadGroup(channel.url, channelCreatorASCardOwner);
    } catch (e) {
        return {error: true, message: "Virgil Group error!", errorMessage: e}
    }
};

export const encryptMessage = async (e3, group, message) => {
    try {
        return await group.encrypt(message);
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












