require('dotenv').config();
const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3333;

//***start***CRON***** */

const interval = 10000;
function cron(ms, fn) {
  async function cb() {
    clearTimeout(timeout);
    await fn();
    setTimeout(cb, ms);
  }
  let timeout = setTimeout(cb, ms);
  // return () => clearTimeout(timeout);
  return () => { };
}

//***finish*********** */

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// const url = 'http://vesti-sudak.ru/';
const url = '`https://the-internet.herokuapp.com/dynamic_content`';

// const articles_data1 = [];

// async function getGanre() {
//   try {
//     const response = await fetch(url);
//     const data = await response.text();
//     const $ = cheerio.load(data);

//     const articles = $('article');
//     articles.each(function () {
//       // link = $(this).find('h1').text() // test
//       link = $(this).find('h2 > a').attr('href'); // official
//       title = $(this).find('h2 > a').text(); // official
//       // image = $(this).find('div > a > img').attr('srcset').split(',') // official
//       image = $(this).find('div > a > img').attr('srcset').split(' ')[0].trim(); // official

//       // articles_data.push({link, title, image})  // official
//       articles_data1.splice(9);
//       articles_data1.push({ link, title, image }); // official
//       // articles_data.push({link}) // test
//     });

//     // console.log(articles_data);

//     return articles_data1; //todo

//     // console.log(articles_data);
//     // console.log(articles_data.length);
//   } catch (error) {
//     console.error(error);
//     console.log(error.message);
//   }
// }

// getGanre()

async function getNews() {
  let news = [];
  const response = await fetch(
    `https://the-internet.herokuapp.com/dynamic_content`
  );
  const html = await response.text();
  const $ = cheerio.load(html);

  $('#content').each((tdx, el) => {
    let image =
      `https://the-internet.herokuapp.com` +
      $(el).find('.row > div > img').attr('src');
    news.push({ image });
  });
  app.locals.news = news;
  console.log(app.locals.news);
  return app.locals.news;
}


app.get('/start', (req, res) => {
  getNews();
  cron(interval, () => getNews()); //! раскомменть и запустится crone
  // res.redirect('/');
  res.status(200).json(app.locals.news);
});

// routes
app.get('/news', (req, res) => {
  res.status(200).json(app.locals.news);
});

app.listen(PORT, () => console.log('Server started!.. on port:', PORT));
