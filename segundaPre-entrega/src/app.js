import express from "express"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import __dirname from "./utils.js"


// rutas
import routerP from "./router/products.js"
import routerC from "./router/carts.js"
import routerV from "./router/views.router.js"


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT,()=>{
    console.log(`El servidor está funcionando correctamente en el puerto ${PORT}`)
})
const io = new Server(httpServer)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//handlebars

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//rutas

app.use('/api/products',routerP)
app.use('/api/carts',routerC)
app.use('/', routerV)

// Socket.io

io.on('connection',  async (socket) => {
    console.log('Nuevo cliente conectado')

    socket.emit('productView', await routerP.readProducts())

    socket.on('addProduct', async (product) => {
        const products = await routerP.readProducts()
        const newProduct = { ...product, id: products.length + 1 }
        products.push(newProduct)
        await writeProducts(products)

        io.emit('productView', products)
    })

    socket.on('deleteProduct', async (productId) => {
        let products = await routerP.readProducts()
        products = products.filter(p => p.id !== productId)
        await writeProducts(products)

        io.emit('productView', products)
    })
})