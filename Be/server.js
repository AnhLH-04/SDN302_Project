const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API LABMANAGEMENT",
            version: "1.0.0",
            description: "API for Lab Management System",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Server",
            },
            {
                url: "https://lab-management-backend-p2n9.onrender.com",
                description: "Production Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./server.js"], // chỉ định file chứa phần comment swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/activity-types:
 *   get:
 *     summary: Lấy danh sách Activity Type
 *     tags: [ActivityType]
 *     responses:
 *       200:
 *         description: Thành công
 */
app.get("/api/activity-types", (req, res) => {
    res.json([{ id: 1, name: "Research" }, { id: 2, name: "Teaching" }]);
});

/**
 * @swagger
 * /api/activity-types:
 *   post:
 *     summary: Tạo mới Activity Type
 *     tags: [ActivityType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
app.post("/api/activity-types", (req, res) => {
    const { name } = req.body;
    res.status(201).json({ message: "Created successfully", name });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📄 Swagger UI available at http://localhost:${PORT}/swagger`);
});
