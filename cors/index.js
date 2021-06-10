const cors = require("cors")

const corsOptions = {
    origin : "https://grssprojectserver.herokuapp.com",
    optionsSuccessStatus : 200,
}
module.exports = cors(corsOptions);