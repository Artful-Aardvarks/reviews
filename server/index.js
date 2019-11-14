const app = require("./app.js"); // App is in a separate file to make testing with supertest easier. I've moved away from supertest, but am keeping the file separation just in case.

app.listen(3001, () => {
  console.log("listening on port 3001");
});
