const app = require("./app");

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`
  );
});
