const app = require("./src/app");
const PORT = process.env.PORT || 3056;

const server = app.listen(PORT , function() {
    console.log(`WSV Ecommerce started with port ${PORT}`);
})

// process.on("SIGINT", function(){
//     console.log("Server express exit"); 
//     //notify.send.....(if the server has any problem )
// });