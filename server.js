// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup

app.use(morgan("dev")); // Logging middleware

app.use(bodyParser.json());

// Custom middleware for request logging
app.use((req, res, next) => {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

// Custom middleware for authentication
app.use((req, res, next) => {
	// Simple authentication middleware (for demonstration purposes)
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader === "Bearer mysecrettoken") {
		next(); // User is authenticated
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
});

// Sample in-memory products database
let products = [
	{
		id: "1",
		name: "Laptop",
		description: "High-performance laptop with 16GB RAM",
		price: 1200,
		category: "electronics",
		inStock: true,
	},
	{
		id: "2",
		name: "Smartphone",
		description: "Latest model with 128GB storage",
		price: 800,
		category: "electronics",
		inStock: true,
	},
	{
		id: "3",
		name: "Coffee Maker",
		description: "Programmable coffee maker with timer",
		price: 50,
		category: "kitchen",
		inStock: false,
	},
];

// Root route
app.get("/", (req, res) => {
	res.send(
		"Welcome to the Product API! Go to /api/products to see all products."
	);
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
	res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res) => {
	const product = products.find((p) => p.id === req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404).json({ message: "Product not found" });
	}
});
// POST /api/products - Create a new product
app.post("/api/products", (req, res) => {
	const newProduct = {
		id: uuidv4(),
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		inStock: req.body.inStock,
	};
	products.push(newProduct);
	res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put("/api/products/:id", (req, res) => {
	const productIndex = products.findIndex((p) => p.id === req.params.id);
	if (productIndex !== -1) {
		const updatedProduct = {
			id: req.params.id,
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			category: req.body.category,
			inStock: req.body.inStock,
		};
		products[productIndex] = updatedProduct;
		res.json(updatedProduct);
	} else {
		res.status(404).json({ message: "Product not found" });
	}
});
// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
	const productIndex = products.findIndex((p) => p.id === req.params.id);
	if (productIndex !== -1) {
		products.splice(productIndex, 1);
		res.json({ message: "Product deleted successfully" });
	} else {
		res.status(404).json({ message: "Product not found" });
	}
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
});
// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
