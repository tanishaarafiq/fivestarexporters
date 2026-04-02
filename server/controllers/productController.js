const Product = require('../models/Product');
const { createLog } = require('../utils/auditHelper');

// @desc    Get all products (with search & filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search by name or partCode
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { partCode: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query).sort({ partCode: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by partCode
// @route   GET /api/products/:partCode
const getProductByPartCode = async (req, res) => {
    try {
        const product = await Product.findOne({ partCode: req.params.partCode });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Admin)
// @route   POST /api/admin/products
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();

        // Audit Log
        await createLog(req, req.user.email, `Created product: ${createdProduct.name} (${createdProduct.partCode})`, 'admin');

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product (Admin)
// @route   PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();

            // Audit Log
            await createLog(req, req.user.email, `Updated product: ${updatedProduct.name} (${updatedProduct.partCode})`, 'admin');

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const prodName = product.name;
            const partCode = product.partCode;
            await product.deleteOne();

            // Audit Log
            await createLog(req, req.user.email, `Deleted product: ${prodName} (${partCode})`, 'admin');

            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductByPartCode, createProduct, updateProduct, deleteProduct };
