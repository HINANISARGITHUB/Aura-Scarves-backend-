// require("dotenv").config();

// const express = require("express");

// const cors = require("cors");

// const connectDB = require("./config/db");

// const { globalErrorHandler } = require("./utils/errorHandler");

// const app = express();

// // Connect DB

// connectDB();

// // Middleware

// const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
//   Boolean,
// );

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) callback(null, true);
//       else callback(new Error("Not allowed by CORS"));
//     },

//     credentials: true,
//   }),
// );




// app.use(express.json({ limit: "10mb" }));

// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Routes

// app.use("/api/auth", require("./routes/auth"));

// app.use("/api/styles", require("./routes/styles"));

// app.use("/api/reviews", require("./routes/reviews"));

// app.use("/api/cart", require("./routes/cart"));

// app.use("/api/favorites", require("./routes/favorites"));

// app.use("/api/admin", require("./routes/admin"));

// app.use("/api/orders", require("./routes/orders"));

// // Health check

// app.get("/api/health", (req, res) =>
//   res.json({ status: "ok", message: "Aura Scarves API running ✨" }),
// );

// // 404

// app.use((req, res) =>
//   res.status(404).json({ message: `Route ${req.originalUrl} not found` }),
// );

// // Global error handler

// app.use(globalErrorHandler);

// // Local development

// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;

//   app.listen(PORT, () =>
//     console.log(`🚀 Aura Scarves server running on port ${PORT}`),
//   );
// }

// module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { globalErrorHandler } = require("./utils/errorHandler");

const app = express();

// Connect DB
connectDB();

// Middleware - CORS (Crash Proof & Safe)
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Production check bypass taake CORS ki wajah se process crash na ho
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🚀 VERCEL ROUTING FIX: Ek main router banaayein saare routes ke liye
const router = express.Router();

router.use("/auth", require("./routes/auth"));
router.use("/styles", require("./routes/styles"));
router.use("/reviews", require("./routes/reviews"));
router.use("/cart", require("./routes/cart"));
router.use("/favorites", require("./routes/favorites"));
router.use("/admin", require("./routes/admin"));
router.use("/orders", require("./routes/orders"));

// Health check inside the api router
router.get("/health", (req, res) =>
  res.json({ status: "ok", message: "Aura Scarves API running ✨" })
);

// Base App ko batayein ke saare routes /api se shuru honge
app.use("/api", router);

// 404 handler (Agar upar koi bhi route match nahi hua)
app.use((req, res) =>
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
);

// Global error handler
app.use(globalErrorHandler);

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Aura Scarves server running on port ${PORT}`)
  );
}

module.exports = app;
