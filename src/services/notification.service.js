"use strict"
const notificationModel = require("../models/notification.model");
const NotiModel = require("../models/notification.model");

const pustNotiToSystem = async({
    type = "SHOP-001",
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content;

    if(type === "SHOP-001"){
        noti_content = "<<shop_name>> vừa thêm một sản phâm <<product_name>>";
    }else if (type === "PROMOTION-001"){
        noti_content = "<<shop_name>> vừa mới thêm một voucher <<voucher_name>>"
    }

    const newNoti = await NotiModel.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receivedId: receivedId,
        noti_options: options
    })

    return newNoti;
}   

const listNotiByUser = async ({
    userId = "1",
    type = "ALL",
    isRead = 0
}) => {
    const match = { noti_receivedId: userId }

    if(type != "ALL"){
        match["noti_type"] = type
    }

    return notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                noti_content: 1,
                createAt: 1,
                noti_options: 1
            }
        }
    ]);
}

module.exports = {
    pustNotiToSystem,
    listNotiByUser
}