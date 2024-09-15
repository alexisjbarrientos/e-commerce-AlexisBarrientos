import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import __dirname from '../utils.js'

const routerP = Router()
const productsFilePath = path.join(__dirname, 'data/products.json')

async function readProducts() {
    const data = await fs.readFile(productsFilePath, 'utf8')
    return JSON.parse(data)
}

async function writeProducts(products) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
}


routerP.get('/', async (req, res) => {
    const products = await readProducts()
    res.json(products)
})

routerP.get('/:pid', async (req, res) => {
    const products = await readProducts()
    const product = products.find(p => p.id === parseInt(req.params.pid))
    product ? res.json(product) : res.status(404).send('Producto no encontrado')
})

export default routerP
