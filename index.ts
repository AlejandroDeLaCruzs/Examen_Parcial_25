import axios from "axios";
import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());









// --- Middleware de error genérico ---
const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error detectado:", err.message);
    res
        .status(500)
        .json({ error: "Error interno del servidor", detail: err.message });
};





// Middleware final (ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de error
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
})

