const express = require('express')
const app = express()

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.render('index')
})

app.listen(process.env.PORT, () => console.log(`riders ready on port ${process.env.PORT}`))