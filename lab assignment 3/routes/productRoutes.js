const express = require('express');
const router = express.Router();
let products = require('../data/products');

// GET /api/v1/products -> Get all products (with optional filtering & pagination)
router.get('/', (req, res, next) => {
    try {
        let { category, limit, page } = req.query;
        let result = [...products];

        // Filtering
        if (category) {
            result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Pagination
        if (limit) {
            limit = parseInt(limit);
            const startIndex = page ? (parseInt(page) - 1) * limit : 0;
            result = result.slice(startIndex, startIndex + limit);
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

// GET /api/v1/products/:id -> Get single product (with field selection)
router.get('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = products.find(p => p.id === id);

        if (!product) {
            const error = new Error(`Product with ID ${id} not found`);
            error.statusCode = 404;
            error.errorCode = "PRODUCT_NOT_FOUND";
            return next(error);
        }

        // Field Selection (REST over-fetching solution) ?fields=title,price
        if (req.query.fields) {
            const fields = req.query.fields.split(',');
            const filteredProduct = {};
            fields.forEach(field => {
                if (product[field] !== undefined) {
                    filteredProduct[field] = product[field];
                }
            });
            return res.status(200).json(filteredProduct);
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
});

// POST /api/v1/products -> Create a new product
router.post('/', (req, res, next) => {
    try {
        const { title, price, category, description, stock } = req.body;

        if (!title || !price) {
            const error = new Error("Title and price are required fields");
            error.statusCode = 400;
            error.errorCode = "VALIDATION_ERROR";
            return next(error);
        }

        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            title,
            price,
            category: category || "general",
            description: description || "",
            stock: stock || 0
        };

        products.push(newProduct);
        res.status(201).json(newProduct); // 201 Created
    } catch (err) {
        next(err);
    }
});

// PUT /api/v1/products/:id -> Idempotent Update
router.put('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { title, price, category, description, stock } = req.body;
        
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            const error = new Error(`Product with ID ${id} not found`);
            error.statusCode = 404;
            error.errorCode = "PRODUCT_NOT_FOUND";
            return next(error);
        }

        if (!title || !price) {
            const error = new Error("Title and price are required for update");
            error.statusCode = 400;
            error.errorCode = "VALIDATION_ERROR";
            return next(error);
        }

        // Idempotent operation: applying it multiple times yields same result
        products[productIndex] = {
            id,
            title,
            price,
            category: category || products[productIndex].category,
            description: description || products[productIndex].description,
            stock: stock !== undefined ? stock : products[productIndex].stock
        };

        res.status(200).json(products[productIndex]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/v1/products/:id -> Delete product
router.delete('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            const error = new Error(`Product with ID ${id} not found`);
            error.statusCode = 404;
            error.errorCode = "PRODUCT_NOT_FOUND";
            return next(error);
        }

        products.splice(productIndex, 1);
        res.status(200).json({ message: "Product successfully deleted", id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
