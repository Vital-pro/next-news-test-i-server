const cheerio = require('cheerio');
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3333

// app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const url = 'http://vesti-sudak.ru/'

const articles_data = []

async function getGanre() {
  try {
    const response = await fetch(url)
    const data = await response.text()
    const $ = cheerio.load(data)

    const articles = $('article')
    articles.each(function() {
      // link = $(this).find('h1').text() // test
      link = $(this).find('h2 > a').attr('href') // official
      title = $(this).find('h2 > a').text() // official
      // image = $(this).find('div > a > img').attr('srcset').split(',') // official
      image = $(this).find('div > a > img').attr('srcset').split(' ')[0].trim() // official

      articles_data.push({link, title, image})  // official
      // articles_data.push({link}) // test
    })

    // console.log(articles_data);

    return articles_data

    // console.log(articles_data);
    // console.log(articles_data.length);


  } catch (error) {
    console.error(error)
    console.log(error.message);
  }
}

// getGanre()
app.get('/start', (req, res) => {
  const resArr = getGanre().then(f => console.log(f)) //!!!!!! ******START!!!
  res.redirect('/')
  res.send('fg!')
  res.status(200).end()
})

// routes
app.get('/news', (req, res) => {
  const {subreddit} = req.params
  // console.log(news);
  // const data = getGanre()
    res.status(200).json(articles_data)

  
})


app.listen(PORT, () => console.log('Server started!.. on port:', PORT))