const { parseDate } = require('./date-utils');
const createMovieDataScrapper = require('./create-scrap-movies-data');

class FakeClient {
  get(url, callback) {
    callback(this.error, this.request, this.responce, this.object);
  }
}

const fakeClient = new FakeClient();
fakeClient.object = {
  mwAac: `
    <section data-mw-section-id="11" id="mwAac">
      <h2 id="Feature_films">Feature films</h2>
      <div class="hatnote navigation-not-searchable" id="mwAag">
        Main article:
        <a href="./List_of_Marvel_Cinematic_Universe_films" title="List of Marvel Cinematic Universe films">
          List of Marvel Cinematic Universe films
        </a>
      </div>
      <table class="wikitable plainrowheaders" id="mwAak">
        <tbody id="mwAao">
          <tr>
            <th scope="col">Film</th>
            <th scope="col">U.S. release date</th>
            <th scope="col">Director(s)</th>
            <th scope="col">Screenwriter(s)</th>
            <th scope="col">Producer(s)</th>
            <th scope="col">Status</th>
          </tr>
          <tr>
            <th colspan="6">
              Phase One<span>
                <sup class="mw-ref" id="cite_ref-MCUTimeline_134-0">
                  <a href="./Marvel_Cinematic_Universe#cite_note-MCUTimeline-134">
                    <span class="mw-reflink-text">[134]</span>
                  </a>
                </sup>
              </span>
            </th>
          </tr>
          <tr>
            <th scope="row">
              <i><a href="./Iron_Man_(2008_film)" title="Iron Man (2008 film)">Iron Man</a></i>
            </th>
            <td>
              May 2, 2008<span> (<span class="bday dtstart published updated">2008-05-02</span>)</span>
            </td>
            <td>
              <a href="./Jon_Favreau">Jon Favreau</a>
              <sup class="mw-ref" id="cite_ref-April2006Variety_135-0">
                <a href="./Marvel_Cinematic_Universe#cite_note-April2006Variety-135">
                  <span class="mw-reflink-text">[135]</span>
                </a>
              </sup>
            </td>
            <td>
              <a href="./Mark_Fergus_and_Hawk_Ostby">Mark Fergus &amp; Hawk Ostby</a> and
              <a href="./Art_Marcum_and_Matt_Holloway">Art Marcum &amp; Matt Holloway</a>
              <sup class="mw-ref" id="cite_ref-April2006Variety_135-1">
                <a href="./Marvel_Cinematic_Universe#cite_note-April2006Variety-135">
                  <span class="mw-reflink-text">[135]</span>
                </a>
              </sup>
              <sup class="mw-ref" id="cite_ref-FergusOstbyIM_136-0">
                <a href="./Marvel_Cinematic_Universe#cite_note-FergusOstbyIM-136">
                  <span class="mw-reflink-text">[136]</span>
                </a>
              </sup>
            </td>
            <td>
              <a href="./Avi_Arad">Avi Arad</a> and <a href="./Kevin_Feige">Kevin Feige</a>
            </td>
            <td rowspan="6">Released</td>
          </tr>
          <tr>
            <th scope="row">
              <i><a href="./The_Incredible_Hulk_(film)">The Incredible Hulk</a></i>
            </th>
            <td>
              June 13, 2008<span> (<span class="bday dtstart published updated">2008-06-13</span>)</span>
            </td>
            <td>
              <a href="./Louis_Leterrier">
                Louis Leterrier
              </a>
              <sup class="mw-ref" id="cite_ref-LeterrierTIH_137-0">
                <a href="./Marvel_Cinematic_Universe#cite_note-LeterrierTIH-137">
                  <span class="mw-reflink-text">[137]</span>
                </a>
              </sup>
            </td>
            <td>
              <a href="./Zak_Penn">
                Zak Penn
              </a>
              <sup class="mw-ref" id="cite_ref-PennUnhappy_138-0">
                <a href="./Marvel_Cinematic_Universe#cite_note-PennUnhappy-138">
                  <span class="mw-reflink-text">[138]</span>
                </a>
              </sup>
            </td>
            <td>
              Avi Arad, <a href="./Gale_Anne_Hurd">Gale Anne Hurd</a>
              <br/> and Kevin Feige
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
};

describe('Scrap Movies Data', () => {
  it('should scrap movie data', done => {
    const scrapMovieData = createMovieDataScrapper(fakeClient);

    const expected = {
      director: 'Jon Favreau',
      film: 'Iron Man',
      id: 0,
      producer: 'Avi Arad and Kevin Feige',
      releaseDate: parseDate('2008-05-02'),
      screenwriter: 'Mark Fergus & Hawk Ostby and Art Marcum & Matt Holloway',
      status: 'Released',
      url: '/Iron_Man_(2008_film)'
    };

    scrapMovieData()
      .then(movies => expect(movies[0]).toEqual(expected))
      .then(done);
  });
});
