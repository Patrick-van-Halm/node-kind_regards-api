import MessageManager from "./Managers/MessageManager.mjs";

export default function (db) {
    const messageManager = new MessageManager(db);

    return {
        "/users": {
            "/:id": {
                "/messages": {
                    get: messageManager.get.bind(messageManager)
                }
            }
        }
    };
}
