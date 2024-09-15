import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import __dirname from '../utils.js'

const routerV = Router()
const productsFilePath = path.resolve(__dirname, 'data/products.json')

routerV.get('/', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al cargar los productos')
        const products = JSON.parse(data)
        res.render('home', { products })
    })
})

routerV.get('/realtimeproducts', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al cargar los productos')
        const products = JSON.parse(data)
        res.render('realTimeProducts', { products })
    })
})

export default routerV
