const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
//配置模板
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/index', (req, res) => {
  readFileData((data) => {
    res.render('index', data)
  })
})

app.get('/', (req, res) => {
  res.redirect('/index')
})

app.get('/details', (req, res) => {
  let id = req.query.id
  readFileData(data => {
    data = data.list.find(item => item.id === +id)
    res.render('details', data)
  })
})

app.get('/submit', (req, res) => {
  res.render('submit')
})

//get请求add
app.get('/add', (req, res) => {
  let obj = req.query
  obj.id = +new Date()
  readFileData(data => {
    data.list.unshift(obj)
    writeFileData(data, () => {
      res.redirect('/index')
    })
  })
})

//post请求add

app.post('/add', (req, res) => {
  let obj = req.body
  obj.id = +new Date()
  readFileData(data => {
    data.list.unshift(obj)
    writeFileData(data, () => {
      res.redirect('/index')
    })
  })
})

app.listen(3080, () => {
  console.log('服务器已启动')
})


//读取文件
function readFileData(callback) {
  let filePath = path.join(__dirname, 'data', 'data.json')
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.log('读取文件失败', err)
    data = JSON.parse(data)
    callback(data)
  })
}

//写入文件
function writeFileData(data, callback) {
  fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2), err => {
    if (err) return console.log('写入文件失败', err)
    callback()
  })
}