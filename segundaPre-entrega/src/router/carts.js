import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import __dirname from '../utils.js'

const routerC = Router()
const cartsFilePath = path.join(__dirname, 'data/carts.json')

async function readCarts() {
    const data = await fs.readFile(cartsFilePath, 'utf8')
    return JSON.parse(data)
}

async function writeCarts(carts) {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))
}

function addId(carts) {
    const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0)
    return maxId + 1
}

routerC.post('/', async (req, res) => {
    const carts = await readCarts()
    const newCart = { id: addId(carts), products: [] }
    carts.push(newCart)
    await writeCarts(carts)
    res.status(201).json(newCart)
})

routerC.get('/:cid', async (req, res) => {
    const carts = await readCarts()
    const cart = carts.find(c => c.id === parseInt(req.params.cid))
    cart ? res.json(cart) : res.status(404).send('Carrito no encontrado')
})

routerC.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readCarts()
    const cart = carts.find(c => c.id === parseInt(req.params.cid))
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.id === parseInt(req.params.pid))
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += req.body.quantity || 1
        } else {
            cart.products.push({ id: parseInt(req.params.pid), quantity: req.body.quantity || 1 })
        }
        await writeCarts(carts)
        res.send('Producto agregado al carrito')
    } else {
        res.status(404).send('Carrito no encontrado')
    }
})

export default routerC
