let express = require('express')
let config = require('./config/index.js')

let port = process.env.PORT || config.build.port

let app = express()

let router = express.Router()

router.get('/', (req, res, next) => {
	req.url = '/index.html'
	next()
})

app.use(router)

var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()

apiRoutes.get('/seller', (req, res)  => {
  res.json({
    errno: 0,
    data: seller
  })
})

apiRoutes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  })
})

apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api', apiRoutes);

app.use(express.static('./dist'))

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('> Listening at http://localhost:' + port +'\n')
})