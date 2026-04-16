import "dotenv/config";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { productRouter } from "./routes/product-routes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ data: { ok: true } });
});

app.use("/api/products", productRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Electronic Store API running at http://localhost:${port}`);
});
