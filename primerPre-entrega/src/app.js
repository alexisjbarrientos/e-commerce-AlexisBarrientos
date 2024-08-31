import express from "express"
// rutas
import productsRouter from './router/products.js'
import cartsRouter from './router/carts.js'


const app = express()
const PORT = 8080

app.use(express.json())

app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)

app.listen(PORT,() =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})