const parseMovieData = require('./parse-movie-data');

describe('Parse Movie Data', () => {
  const id = 0;

  const row = `<tr>
    <th scope="row" style="text-align:left">
      <i>
        <a href="/wiki/Iron_Man_(2008_film)" title="Iron Man (2008 film)">
          Iron Man
        </a>
      </i>
    </th>
    <td style="text-align:left">
      May&nbsp;2,&nbsp;2008
      <span style="display:none">
        &nbsp;(<span class="bday dtstart published updated">2008-05-02</span>)
      </span>
    </td>
    <td>
      <a href="/wiki/Jon_Favreau" title="Jon Favreau">
        Jon Favreau
      </a>
      <sup id="cite_ref-April2006Variety_135-0" class="reference">
        <a href="#cite_note-April2006Variety-135">
          [135]
        </a>
      </sup>
    </td>
    <td>
      <a href="/wiki/Mark_Fergus_and_Hawk_Ostby" title="Mark Fergus and Hawk Ostby">
        Mark Fergus &amp; Hawk Ostby
      </a>
      &nbsp;and&nbsp;
      <a href="/wiki/Art_Marcum_and_Matt_Holloway" title="Art Marcum and Matt Holloway">
        Art Marcum &amp; Matt Holloway
      </a>
      <sup id="cite_ref-April2006Variety_135-1" class="reference">
        <a href="#cite_note-April2006Variety-135">
          [135]
        </a>
      </sup>
      <sup id="cite_ref-FergusOstbyIM_136-0" class="reference">
        <a href="#cite_note-FergusOstbyIM-136">
          [136]
        </a>
      </sup>
    </td>
    <td>
      <a href="/wiki/Avi_Arad" title="Avi Arad">
        Avi Arad
      </a>
      &nbsp;and&nbsp;
      <a href="/wiki/Kevin_Feige" title="Kevin Feige">
        Kevin Feige
      </a>
    </td>
    <td rowspan="6">
      Released
    </td>
  </tr>`;

  const headers = [
    'film',
    'releaseDate',
    'director',
    'screenwriter',
    'producer',
    'status'
  ];

  it('should parse movie data', () => {
    const actual = parseMovieData(id, row, headers);
    const expected = {
      director: 'Mark Fergus & Hawk Ostby and Art Marcum & Matt Holloway',
      film: '2008-05-02T00:00:00+02:00',
      id: 0,
      producer: 'Released',
      releaseDate: 'Jon Favreau',
      screenwriter: 'Avi Arad and Kevin Feige',
      status: 'Released'
    };

    expect(actual).toEqual(expected);
  });

  it('should return null', () => {
    const actual = parseMovieData(id, '', headers);

    expect(actual).toBeNull();
  });

  it('should throw error if headers is Falsy', () => {
    expect(() => parseMovieData(id, row, null)).toThrow('headers should be defined');
  });

  it('should throw error if headers is empty', () => {
    expect(() => parseMovieData(id, row, [])).toThrow('headers should not be empty');
  });
});
