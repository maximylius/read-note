const divsParser = (
  textcontent,
  ranges,
  formattingNeeded = true,
  textOffest = 0
) => {
  const divHierachy = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    'ol',
    'ul',
    'li',
    'a',
    'strong',
    'em',
    'i',
    'span'
  ]; //2do handle what happens if <h2><em></h2></em> => <h2><em></em><h2><em></em>
  const standardSpan = (begin, end, div = null) => ({
    id: `${begin}-${end}`,
    rangeIds: [],
    begin: begin,
    end: end,
    sectionIds: [],
    categoryIds: [],
    div: div,
    divBegin: div ? [div] : [],
    divEnd: div ? [div] : [],
    fontWeight: '',
    fontStyle: '',
    textDecoration: '',
    color: ''
  });
  ranges = [...ranges];
  if (textcontent.length > 160) {
    ranges.push({ ...standardSpan(10, 49, 'h2'), color: 'pink' });
    ranges.push({ ...standardSpan(60, 80), color: 'green' });
    ranges.push({ ...standardSpan(60, 80, 'h5') });
    ranges.push({ ...standardSpan(120, 140, 'ol') });
    ranges.push({ ...standardSpan(120, 130, 'li') });
    ranges.push({ ...standardSpan(131, 140, 'li') });
    ranges.push({ ...standardSpan(111, 145, 'h3') });
    ranges.push({ ...standardSpan(114, 142, 'em') });
    ranges.push({ ...standardSpan(150, 155, 'a') });
    ranges.push({
      ...standardSpan(100, 132),
      color: 'pink',
      textDecoration: 'underline'
    });
  }
  if (ranges.length === 0) {
    return [
      {
        htmlTag: null,
        divs: [],
        attr: {
          ...standardSpan(0, textcontent.length - 1),
          textcontent: textcontent
        }
      }
    ];
  }

  ranges.sort(
    (a, b) =>
      a.begin !== b.begin
        ? a.begin - b.begin // first starts first
        : a.end !== b.end
        ? b.end - a.end // parent section first
        : a.div && !b.div
        ? -1
        : !a.div && b.div
        ? 1
        : !a.div && !b.div
        ? 0
        : divHierachy.indexOf(a.div) - divHierachy.indexOf(b.div) // first ranks first
  );
  if (formattingNeeded === true) {
    for (let i = 0; i < ranges.length; i++)
      ranges[i] = {
        id: i,
        rangeIds: [],
        begin: ranges[i].begin,
        end: ranges[i].end,
        sectionIds: ranges[i]._id ? [ranges[i]._id] : [],
        categoryIds: ranges[i].categoryIds ? ranges[i].categoryIds : [],
        div: ranges[i].div ? ranges[i].div : null,
        divBegin: ranges[i].div ? [ranges[i].div] : [],
        divEnd: ranges[i].div ? [ranges[i].div] : [],
        fontWeight: ranges[i].fontWeight ? ranges[i].fontWeight : '',
        fontStyle: ranges[i].fontStyle ? ranges[i].fontStyle : '',
        textDecoration: ranges[i].textDecoration
          ? ranges[i].textDecoration
          : '',
        color: ranges[i].color ? ranges[i].color : null
      };
  } else {
    for (let i = 0; i < ranges.length; i++) ranges[i].id = i;
  }
  const informSpan = (span, range) => {
    span.rangeIds = [...span.rangeIds, range.id];
    span.sectionIds = [
      ...span.sectionIds,
      ...[range.sectionIds ? range.sectionIds : []].flat(1)
    ];
    span.categoryIds = [
      ...span.categoryIds,
      ...[range.categoryIds ? range.categoryIds : []].flat(1)
    ];
    span.fontWeight = range.fontWeight ? range.fontWeight : span.fontWeight;
    span.fontStyle = range.fontStyle ? range.fontStyle : span.fontStyle;
    span.textDecoration = range.textDecoration
      ? range.textDecoration
      : span.textDecoration;
    span.color = range.color ? range.color : span.color;
  };

  // get a list of all intersections
  const intersections = [
    0, // if a range starts at 0, 0 has to be included twice.
    ...new Set(
      [
        ranges.map((range, index) => [
          range.begin - Math.min(index, 1),
          range.begin,
          Math.min(range.end + 1, textcontent.length - 1)
        ])
      ].flat(2)
    ),
    textcontent.length - 1
  ];
  intersections.sort((a, b) => a - b);

  // spread spans along intersctions
  const spreadedSpans = [];

  for (let i = 0; i < intersections.length; i++) {
    if (i === 0) continue;
    const concernedRanges = ranges.filter(
      range => range.begin === intersections[i - 1]
    );

    let consolidatedSpan = standardSpan(
      intersections[i - 1],
      intersections[i] === textcontent.length - 1
        ? intersections[i]
        : intersections[i] - 1
    );

    if (concernedRanges.length > 0) {
      for (let j = 0; j < concernedRanges.length; j++) {
        // standard update span
        informSpan(consolidatedSpan, concernedRanges[j]);

        // fine tune span div...
        if (
          consolidatedSpan.begin === concernedRanges[j].begin &&
          concernedRanges[j].divBegin.length > 0
        ) {
          consolidatedSpan.divBegin = [
            ...consolidatedSpan.divBegin,
            concernedRanges[j].div
          ];
        }

        if (
          consolidatedSpan.end === concernedRanges[j].end &&
          concernedRanges[j].divEnd.length > 0
        ) {
          consolidatedSpan.divEnd = [
            ...consolidatedSpan.divEnd,
            concernedRanges[j].div
          ];
        }
        if (intersections[i] < concernedRanges[j].end) {
          // consolidatedSpan.divEnd.shift(); // remove first or last?
        }

        // update remaining ranges part
        ranges[concernedRanges[j].id].begin = Math.min(
          intersections[i],
          concernedRanges[j].end
        );
        ranges[concernedRanges[j].id].divBegin = [];
      }
    }
    spreadedSpans.push(consolidatedSpan);
  }

  // reduce number of spans
  const compareSpanIds = (a, b) =>
    a.length === b.length && !a.some(el => !b.includes(el));
  const reducedSpans = [];
  let spanToPush = spreadedSpans[0];

  for (let i = 0; i < spreadedSpans.length; i++) {
    if (i === 0) continue;

    if (compareSpanIds(spanToPush.rangeIds, spreadedSpans[i].rangeIds)) {
      spanToPush.end = spreadedSpans[i].end;
      spanToPush.divEnd.push(...spreadedSpans[i].divEnd);
    } else {
      spanToPush.textcontent = textcontent.slice(
        spanToPush.begin,
        spanToPush.end + 1
      );
      reducedSpans.push({ ...spanToPush });

      spanToPush = spreadedSpans[i];
    }

    if (i === spreadedSpans.length - 1) {
      spanToPush.textcontent = textcontent.slice(
        spanToPush.begin,
        spanToPush.end + 1
      );
      reducedSpans.push({ ...spanToPush });
    }
  }

  const nestedDivs = [];
  let currentPosition,
    paths = [];

  reducedSpans.forEach(reducedSpan => {
    reducedSpan.id = `${reducedSpan.begin}-${reducedSpan.end}`;
    currentPosition = nestedDivs;
    paths.forEach(path => (currentPosition = currentPosition[path].divs));

    // nest deeper...
    for (let i = 0; i < reducedSpan.divBegin.length; i++) {
      if (i < reducedSpan.divBegin.length - 1) {
        // add deeper level
        currentPosition.push({
          attr: null,
          divs: [],
          htmlTag: reducedSpan.divBegin[i]
        });
      } else {
        // add div content to deepest level
        currentPosition.push({
          attr: null,
          divs: [
            {
              attr: { ...reducedSpan },
              divs: [],
              htmlTag: null
            }
          ],
          htmlTag: reducedSpan.divBegin[i]
        });
      }
      // change path into deeper level...
      paths.push(currentPosition.length - 1);
      currentPosition = currentPosition[currentPosition.length - 1].divs;
    }

    // add to divs if not done before at divBegin...
    if (reducedSpan.divBegin.length === 0) {
      currentPosition = nestedDivs;
      paths.forEach(path => (currentPosition = currentPosition[path].divs));

      currentPosition.push({
        attr: { ...reducedSpan },
        divs: [],
        htmlTag: null
      });
    }

    // toggle up the ...
    for (let i = 0; i < reducedSpan.divEnd.length; i++) {
      // change directory upwards...
      paths.pop();
      currentPosition = nestedDivs;
      paths.forEach(path => (currentPosition = currentPosition[path].divs));
    }
  });

  return nestedDivs;
};

export default divsParser;
// const textcontent =
//   'Let me paste some plain text here and there. This should just mimic a Text. And I keep on writing because it is important to me that this text finally works. If it works I might post the solution on stack overflow. But maybe I will be to lazy for that. I think that should be enough text for now.';
// // textcontent.length = 296
// console.log(
//   '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
//   newOptimizer(textcontent, [
//     ...textspans,
//     ...Object.keys(sectionsById).map(id => sectionsById[id])
//   ])
// );

// for(let i=0; i<reducedSpan.divBegin.length; i++){

//   if (currentDivByLevel[level].div === null && index > 0) {
//     divs.push({ attr: {...currentDivByLevel[level]}, divs: null });
//     currentDivByLevel[level].div = null;
//     currentDivByLevel[level].spans = [];
//   }
//   console.log(reducedSpan.divBegin[0]);
//   currentDivByLevel[level].div = reducedSpan.divBegin[0];
//   // if already currentDivByLevel[level]...
//   // else...
// }
// currentDivByLevel[level].spans.push({ ...reducedSpan });

// if (reducedSpan.divEnd.length > 0) {
//   divs.push({ ...currentDivByLevel[level] });
//   currentDivByLevel[level].div = null;
//   currentDivByLevel[level].spans = [];
// }

// if (
//   index === reducedSpans.length - 1 &&
//   currentDivByLevel[level].spans.length > 0
// ) {
//   divs.push({ ...currentDivByLevel[level] });
// }
