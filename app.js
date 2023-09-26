const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim()
  const matchedRestaurant = keyword ? restaurants.filter(ra => {
    if (typeof ra.name === 'string' && typeof ra.category === 'string') {
      return ra.name.toLowerCase().includes(keyword) || ra.category.toLowerCase().includes(keyword)
    }
    else return false
    //filter函數會過濾true以外的元素，當return返回false時會自動被過濾轉為空字串
    //這就是為甚麼當輸入餐廳以外的字時不會搜尋到任何東西
  }) : restaurants

  res.render('index', { restaurants: matchedRestaurant, keyword });
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find(ra => ra.id.toString() === id)
  res.render(`show`, { restaurant })
})

app.listen(port, function (req, res) {
  console.log(`express server is running on http:/localhost:${port}`);
})