const app = require("./src/app");
const PORT = 3055;

const server = app.listen(PORT , function() {
    console.log(`WSV Ecommerce started with port ${PORT}`);
})

// process.on("SIGINT", function(){
//     console.log("Server express exit"); 
//     //notify.send.....(if the server has any problem )
// });