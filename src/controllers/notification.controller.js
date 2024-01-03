const { listNotiByUser } = require("../services/notification.service");
const { CREATED, OK } = require("../core/success.response");

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        const result = await listNotiByUser(req.query)

        new CREATED({
            message: "get list noti by user sucessfull",
            metadata: result
        }).send(res);
    }
}

module.exports = new NotificationController();