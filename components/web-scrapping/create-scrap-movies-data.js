const _ = require('lodash');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const config = require('../config');
const { parseHeaderCell } = require('./parse-header-cells');
const parseCell = require('./parse-cell');
const parseMovieData = require('./parse-movie-data');
const isEmptyRow = require('./is-empty-row');
const isPhaseRow = require('./is-phase-row');

const { pageHtmlEndpointPath } = config.wikiApi;
const featureFilmsSectionId = 'mwAac';

// const getHeaders = $headers => {
//   const headersTexts = [];

//   $headers.each((_, headerCell) =>
//     headersTexts.push(cheerio.load(headerCell).text())
//   );

//   return parseHeaderCells(headersTexts);
// };

function getRowHtml(row) {
  const $ = cheerio.load('<table></table>');
  const $table = $('table');

  $table.append(row);

  return $table.find('tr').html();
}

const createMovieDataScrapper = client => () =>
  new Promise((resolve, reject) =>
    client.get(
      {
        path: `${pageHtmlEndpointPath}/Marvel_Cinematic_Universe`,
        query: {
          sections: featureFilmsSectionId
        }
      },
      (error, request, response, content) => {
        if (error) {
          reject(error);
        }

        const html = content[featureFilmsSectionId];

        if (!html) {
          resolve([]);
        }

        const $ = cheerio.load(html);
        const table = $('.wikitable');
        const headers = getHeaders(table.find('tr:first-child th'));
        const movies = [];

        table
          .find('tr')
          .filter((_, row) => !isPhaseRow($(row).text()))
          .filter((_, row) => !isEmptyRow(row))
          .each((id, row) => {
            const movieData = parseMovieData(id, getRowHtml(row), headers);

            movies.push(movieData);
          });

        resolve(movies);
      }
    )
  );

const scrapMoviesData = async (req, res, next) => {
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  await page.goto(config.wikiApi.url);

  const rawData = await page.evaluate(() => {
    const header = document.querySelector('#Feature_films');
    const getMoviesTable = node => {
      const nextNode = node.nextElementSibling;

      return nextNode.classList.contains('wikitable')
        ? nextNode
        : getMoviesTable(nextNode);
    };

    const table = getMoviesTable(header.parentElement);

    const moviesData = Array.from(table.querySelectorAll('tr'))
      .filter(row => !row.textContent.includes('Phase'))
      .map(row =>
        Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent)
      );

    return JSON.stringify(moviesData);
  });

  await page.close();
  await browser.close();

  const [headers, ...data] = JSON.parse(rawData);

  const d = data.map(movie => {
    const parsedMovie = movie.map((movieData, index) => {
      const header = parseHeaderCell(headers[index]);
      const cellData = parseCell(movieData);

      return [header, cellData];
    });

    return _.fromPairs(parsedMovie);
  });

  res.end(JSON.stringify({ movies: d }));

  next();
};

module.exports = { createMovieDataScrapper, scrapMoviesData };
