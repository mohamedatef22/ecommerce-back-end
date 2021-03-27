const express = require("express");
const app = express();
const userRoute = require("./routes/user");
require("./startup/db")();

app.use(express.json());
app.use("/api/user/", userRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`connected to port: ${port}`);
});
