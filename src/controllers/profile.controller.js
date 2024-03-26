 'use strict'
const { OK } = require("../core/success.response");
const dataProfiles = [
    {
        usr_id: 1,
        usr_name: "Ronado",
        usr_avt: "image.com/user/1"
    },
    {
        usr_id: 2,
        usr_name: "Messi",
        usr_avt: "image.com/user/2"
    },
    {
        usr_id: 3,
        usr_name: "Thienngo",
        usr_avt: "image.com/user/3 "
    }
]

class ProfileController{
    //admin
    profiles = async (req, res, next) => {
        new OK({
            message: "View all profiles",
            metadata: dataProfiles
        }).send(res)
    }

    //shop
    profile = async (req, res, next) => {
        new OK({
            message: "View own profile",
            metadata:  {
                usr_id: 2,
                usr_name: "Messi",
                usr_avt: "image.com/user/2"
            }
        }).send(res)
    }
 }

 module.exports = new ProfileController()