import { Router } from "express"
import fs from "fs"
import path from "path"

const router = Router()
const cartsFilePath = path.resolve('../data/carts.json')

// crear un carrito nuevo.

router.post('/', (req, res) => {
    const newCart = { id: Date.now().toString(), products: [] }
    fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        const carts = JSON.parse(data)
        carts.push(newCart)
        fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), err => {
            if (err) return res.status(500).send(err)
            res.status(201).json(newCart)
        })
    })
})

//obtener los productos del carrito.

router.get('/:cid', (req, res) => {
    const cid = req.params.cid
    fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        const carts = JSON.parse(data)
        const cart = carts.find(c => c.id === cid)
        if (!cart) return res.status(404).send('Carrito no encontrado')
        res.json(cart.products)
    })
})

//agregar un producto al carrito.

router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity || 1

    fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        const carts = JSON.parse(data)
        const cart = carts.find(c => c.id === cid)
        if (!cart) return res.status(404).send('Carrito no encontrado')

        const existingProduct = cart.products.find(p => p.product === pid)
        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }

        fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), err => {
            if (err) return res.status(500).send(err)
            res.status(201).json(cart)
        })
    })
})


export default router
