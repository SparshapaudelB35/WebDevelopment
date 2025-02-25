import { Product } from '../../models/index.js'


/**
 *  fetch all products
 */
const getAll = async (req, res) => {
    try {
        //fetching all the data from product table
        const product = await Product.findAll();
        res.status(200).send({ data: product, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

/** 
 *  add new product
*/

const add = async (req, res) => {

    try {
        const body = req.body
        console.log(req.body)
        //validation
        if (!body?.price || !body?.name || !body?.description)
            return res.status(500).send({ message: "Invalid paylod" });
        const products = await Product.create({
            name: body.name,
            price: body.price,
            description: body.description
        });
        res.status(201).send({ data: products, message: "successfully added product" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to add product' });
    }
}

/**
 *  update existing product
 */

const update = async (req, res) => {

    try {
        const { id = null } = req.params;
        const body = req.body;
        console.log(req.params)
        //checking if product exist or not
        const oldProduct = await Product.findOne({ where: { id } })
        if (!oldProduct) {
            return res.status(500).send({ message: "Product not found" });
        }
        oldProduct.name = body.name;
        oldProduct.price = body.price || oldProduct.password;
        oldProduct.description = body.description
        oldProduct.save();
        res.status(201).send({ data: oldProduct, message: "Product updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update Product' });
    }
}

/**
 *  delete product
 */
const delelteById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const oldProduct = await Product.findOne({ where: { id } })

        //checking if Product exist or not
        if (!oldProduct) {
            return res.status(500).send({ message: "Product not found" });
        }
        oldProduct.destroy();
        res.status(201).send({ message: "Product deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch Product' });
    }
}

/**
 *  fetch product by id
 */
const getById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const product = await Product.findOne({ where: { id } })
        if (!product) {
            return res.status(500).send({ message: "Product not found" });
        }
        res.status(201).send({ message: "Product fetched successfully", data: product })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}


export const productController = {
    getAll,
    add,
    getById,
    delelteById,
    update
}