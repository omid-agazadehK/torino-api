require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
let swaggerDocument = require("./swagger/swagger.json");
const path = require("path");

const app = express();

// CORS کامل
app.use(
  cors({
    origin: "*", // یا می‌تونی دامنه دقیق توی Render بذاری
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// Swagger قبل از route ها
swaggerDocument.servers = [
  {
    url: "https://torino-api-sitc.onrender.com",
    description: "Render server",
  },
];

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route ها
app.use(require("./routes/dev"));
app.use("/auth", require("./routes/auth"));
app.use("/tour", require("./routes/tour"));
app.use("/basket", require("./routes/basket"));
app.use("/user", require("./routes/user"));
app.use("/order", require("./routes/order"));

app.get("/", (req, res) => {
  res.send("Welcome to the Tour and Travel Agency API!");
});

// PORT واقعی
const PORT = process.env.PORT || 6501;
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(
      `Swagger API docs are available at https://torino-api-sitc.onrender.com/api-docs`
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying port ${+port + 1}...`);
      startServer(+port + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(PORT);
