const admin = require("firebase-admin");
const serviceAccount = require("./config/firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const pointsOfInterest = [
    // Museos
    {
        name: "Museo O'Higginiano y de Bellas Artes",
        description: "Museo histórico ubicado en una casona colonial que exhibe obras de arte y piezas relacionadas con Bernardo O'Higgins.",
        latitude: -35.4264,
        longitude: -71.6554,
        type: "museum",
        image_url: "https://www.museoohigginiano.gob.cl/sites/www.museoohigginiano.gob.cl/files/styles/imagen_700x700/public/2021-05/Fachada%20Museo%20O%27Higginiano%20y%20de%20Bellas%20Artes%20de%20Talca%20%282%29.JPG?itok=vLwF5j0k",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Museo de Arte y Artesanía",
        description: "Exhibición de artesanía tradicional chilena y arte contemporáneo en un edificio histórico.",
        latitude: -35.4242,
        longitude: -71.6558,
        type: "museum",
        image_url: "https://www.museodetalca.gob.cl/sites/www.museodetalca.gob.cl/files/styles/imagen_700x700/public/2021-05/Fachada%20Museo%20de%20Arte%20y%20Artesan%C3%ADa%20de%20Talca.jpg?itok=Q9X9Q8Zw",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },

    // Parques
    {
        name: "Plaza de Armas de Talca",
        description: "Plaza principal de la ciudad, rodeada de importantes edificios históricos y lugar de encuentro social.",
        latitude: -35.4258,
        longitude: -71.6553,
        type: "park",
        image_url: "https://live.staticflickr.com/7456/27534592566_813c5e9747_b.jpg",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Alameda Bernardo O'Higgins",
        description: "Parque lineal histórico con abundante vegetación y áreas de descanso.",
        latitude: -35.4283,
        longitude: -71.6556,
        type: "park",
        image_url: "https://www.monumentos.gob.cl/sites/default/files/styles/imagen_700x700/public/2017-07/alameda_talca.jpg?itok=Y8X9Q8Zw",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },

    // Sitios Históricos
    {
        name: "Catedral de Talca",
        description: "Catedral neoclásica construida en el siglo XIX, símbolo religioso e histórico de la ciudad.",
        latitude: -35.4256,
        longitude: -71.6551,
        type: "historic_site",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Catedral_de_Talca.jpg/1200px-Catedral_de_Talca.jpg",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Villa Cultural Huilquilemu",
        description: "Casona colonial del siglo XVIII que alberga un museo de arte religioso y artesanía tradicional.",
        latitude: -35.4089,
        longitude: -71.6281,
        type: "historic_site",
        image_url: "https://www.patrimonioculturaldechile.cl/sites/default/files/styles/imagen_700x700/public/2017-07/villa_cultural_huilquilemu.jpg?itok=X8Y9Q8Zw",
        average_rating: 0,
        total_reviews: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    }
];

async function initializeFirestore() {
    try {
        // Primero, eliminar todas las colecciones existentes
        console.log("Eliminando colecciones existentes...");

        // Eliminar points_of_interest y sus subcolecciones
        const pointsSnapshot = await firestore.collection("points_of_interest").get();
        const batch = firestore.batch();

        for (const doc of pointsSnapshot.docs) {
            // Eliminar las reseñas de cada punto
            const reviewsSnapshot = await doc.ref.collection("reviews").get();
            reviewsSnapshot.docs.forEach(reviewDoc => {
                batch.delete(reviewDoc.ref);
            });
            // Eliminar el punto
            batch.delete(doc.ref);
        }

        await batch.commit();
        console.log("Colecciones eliminadas exitosamente.");

        // Agregar nuevos puntos de interés
        console.log("Agregando nuevos puntos de interés...");

        for (const point of pointsOfInterest) {
            const docRef = await firestore.collection("points_of_interest").add(point);
            console.log(`Punto agregado con ID: ${docRef.id}`);

            // Agregar una reseña de ejemplo para cada punto
            await docRef.collection("reviews").add({
                rating: 5,
                comment: "¡Excelente lugar para visitar!",
                userId: "usuario_ejemplo",
                created_at: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log("Inicialización completada exitosamente.");
    } catch (error) {
        console.error("Error durante la inicialización:", error);
    } finally {
        // Cerrar la conexión con Firebase
        process.exit(0);
    }
}

// Ejecutar la inicialización
initializeFirestore();