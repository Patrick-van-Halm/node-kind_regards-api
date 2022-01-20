// Services
import MessageService from "./Services/MessageService.mjs";
import UserService from "./Services/UserService.mjs";
import StickerService from "./Services/StickerService.mjs";
import TextService from "./Services/TextService.mjs";
import CategoryService from "./Services/CategoryService.mjs";
import RequestService from "./Services/RequestService.mjs";
import GiftService from "./Services/GiftService.mjs";
import ThanksService from "./Services/ThanksService.mjs";

// Managers
import MessageManager from "./Managers/MessageManager.mjs";
import TextManager from "./Managers/TextManager.mjs";
import CategoryManager from "./Managers/CategoryManager.mjs";
import RequestManager from "./Managers/RequestManager.mjs";
import UserManager from "./Managers/UserManager.mjs";
import StickerManager from "./Managers/StickerManager.mjs";

export default function (db) {
    const services = {};
    services.sticker = new StickerService(db);
    services.category = new CategoryService(db);
    services.text = new TextService(db);
    services.user = new UserService(db);
    services.request = new RequestService(db);
    services.gift = new GiftService(db);
    services.thanks = new ThanksService(db);
    services.message = new MessageService(db);

    const managers = {
        message: new MessageManager(services),
        text: new TextManager(services),
        category: new CategoryManager(services),
        request: new RequestManager(services),
        user: new UserManager(services),
        sticker: new StickerManager(services)
    };

    return {
        "/users": {
            "/authenticate": {
                get: managers.user.getByAuth.bind(managers.user)
            },
            "/register": {
                post: managers.user.create.bind(managers.user)
            },
            "/messages": {
                get: managers.message.get.bind(managers.message),
                "/:id": {
                    "/thank": {
                        get: managers.message.sendThanks.bind(managers.message)
                    },
                    "/seen": {
                        get: managers.message.markSeen.bind(managers.message)
                    }
                },
                "/sent":{
                    get: managers.message.getSentMessages.bind(managers.message),
                    "/thank": {
                        "/seen": {
                            get: managers.message.markThanksSeen.bind(managers.message)
                        }
                    }
                }
            }
        },
        "/categories": {
            get: managers.category.all.bind(managers.category),
            "/:id": {
                "/texts": {
                    get: managers.text.allByCategory.bind(managers.text)
                }
            }
        },
        "/request": {
            get: managers.request.all.bind(managers.request),
            post: managers.request.create.bind(managers.request),
            "/:id": {
                post: managers.message.create.bind(managers.message)
            },
        },
        "/stickers": {
            get: managers.sticker.get.bind(managers.sticker)
        }
    };
}
