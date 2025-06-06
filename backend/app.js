import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import jobsRouter from "./routes/jobs.js";
import messagesRouter from "./routes/messages.js";
import reviewsRouter from "./routes/reviews.js";
import paymentsRouter from "./routes/payments.js";
import testRouter from "./routes/test.js";

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true, // Permitir cookies e credenciais
    }),
);
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use("/api", indexRouter); // Rota principal/dashboard
app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/tests", testRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // Mantemos os detalhes de erro apenas em desenvolvimento
    const error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message || "Erro interno no servidor",
        error: req.app.get("env") === "development" ? error : {},
    });
});

// Iniciar servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
