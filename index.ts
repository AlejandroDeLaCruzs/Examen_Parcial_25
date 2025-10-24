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

type LD = {
    id: number;
    filmName: string;
    rotationType: "CAV" | "CLV";
    region: string;
    lengthMinutes: number;
    videoFormat: "NTSC" | "PAL";
}

let discos: LD[] = [
    {
        id: 1,
        filmName: "Mision Imposible",
        rotationType: "CAV",
        region: "USA",
        lengthMinutes: 150,
        videoFormat: "NTSC"
    },
    {
        id: 2,
        filmName: "Prueba",
        rotationType: "CLV",
        region: "UK",
        lengthMinutes: 120,
        videoFormat: "PAL"
    },
];





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




// --Rutas
app.get("/ld", (req: Request, res: Response) => {
    res.status(200).json(discos);
})

app.get("/ld/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const discoBuscado = discos.find((disco) => disco.id === id);
    if (!discoBuscado) return res.status(404).json({ error: " Disco no encontrado" });
    return res.status(200).send(discoBuscado);
})


app.post("/ld", (req: Request, res: Response) => {
    const ultimoDisco = discos.at(-1);
    const nuevoID = ultimoDisco ? ultimoDisco.id + 1 : 0;

    const nuevoDisco: LD = {
        id: nuevoID,
        ...req.body
    }
    discos.push(nuevoDisco);

    return res.status(202).send(nuevoDisco);
})

app.delete("/ld/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const index = discos.findIndex((disco) => disco.id === id);
    if (index === -1) {
        return res.status(404).send({ error: " Disco no encontrado" });
    }
    discos = discos.filter((disco) => disco.id !== id)

    res.status(202).send({ message: "Disco eliminado correctamente" });

})




// Middleware final (ruta no encontrada)
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de error
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
})



const testApi = async () => {
    setTimeout(() => {
        console.log("Han pasado 1 segundos");
    }, 1000);

    await axios.
        get("http://localhost:3000/ld")
        .then((res) => console.log(res.data));

    await axios.
        post("http://localhost:3000/ld",
            {
                filmName: "AAAAA",
                rotationType: "CLV",
                region: "ESPAÑA",
                lengthMinutes: 130,
                videoFormat: "PAL"
            }
        )
        .then((res) => console.log(res.data));

    await axios.
        get("http://localhost:3000/ld")
        .then((res) => console.log(res.data));

    await axios.
        delete("http://localhost:3000/ld/3")
        .then((res) => console.log(res.data));

    await axios.
        get("http://localhost:3000/ld")
        .then((res) => console.log(res.data));
}

testApi();