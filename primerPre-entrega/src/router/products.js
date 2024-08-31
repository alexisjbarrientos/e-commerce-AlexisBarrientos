import { Router } from "express"
import fs from  'fs'
import path from "path"

const productsFilePath = path.resolve('../data/products.json')
const router = Router()

// obtener los productos

router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 0
    fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        let products = JSON.parse(data)
        if (limit > 0) products = products.slice(0, limit)
        res.json(products)
    })
})

// obtener producto por ID

router.get('/:pid', (req, res) => {
    const pid = req.params.pid
    fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        const products = JSON.parse(data)
        const product = products.find(p => p.id === pid)
        if (!product) return res.status(404).send('Producto no encontrado')
        res.json(product)
    })
})

//agregar un  nuevo producto

router.post('/', (req, res) => {
    const newProduct = { ...req.body, id: Date.now().toString(), status: req.body.status ?? true }
    fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        const products = JSON.parse(data)
        products.push(newProduct)
        fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send(err)
            res.status(201).json(newProduct)
        })
    })
})

//actualizar un producto

router.put('/:pid', (req, res) => {
    const pid = req.params.pid
    const updatedProduct = req.body
    fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        let products = JSON.parse(data)
        products = products.map(p => p.id === pid ? { ...p, ...updatedProduct } : p)
        fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send(err)
            res.json(products.find(p => p.id === pid))
        })
    })
})

//eliminar un producto 

router.delete('/:pid', (req, res) => {
    const pid = req.params.pid
    fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send(err)
        let products = JSON.parse(data)
        products = products.filter(p => p.id !== pid)
        fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send(err)
            res.status(204).send()
        })
    })
})

export default router