console.log(
  '-----------------------------------------------------------------------------------------------------------------------------------------------------'
);

const spansByIdCreator = (textcontent, textspans, sectionsById = {}) => {
  // 2do reduce incoming textspans and sectionsById to necessary parts
  const ranges = [
    ...textspans.map(textspan => ({
      ...textspan, // reduce to necessary parts
      parents: [],
      children: [],
      sectionIds: [],
      categoryIds: []
    })),
    Object.keys(sectionsById).map(id => ({
      ...sectionsById[id], //implement begin & end // reduce to necessary parts
      sectionIds: [sectionsById[id]._id],
      categoryIds: [sectionsById[id].categoryId],
      parents: [],
      children: [],
      div: null,
      bold: null,
      underlinened: null,
      strikeThrough: null,
      color: null
    }))
  ].flat(1);

  if (ranges.length === 0) return 'nothing supplied...';

  const family = [...ranges];
  family.sort((a, b) =>
    a.begin !== b.begin ? a.begin - b.begin : a.end - b.end
  );

  const standardFamilyMember = {
    id: null,
    parents: [],
    children: [],
    begin: null,
    end: null,
    sectionIds: [],
    categoryIds: [],
    div: null,
    bold: null,
    underlinened: null,
    strikeThrough: null,
    color: null
  };

  const informRelative = (relative, informant) => {
    relative.sectionIds = [...relative.sectionIds, ...informant.sectionIds];
    relative.categoryIds = [...relative.categoryIds, ...informant.categoryIds];
    relative.div = relative.div ? relative.div : informant.div;
    relative.bold = relative.bold ? relative.bold : informant.bold;
    relative.underlinened = relative.underlinened
      ? relative.underlinened
      : informant.underlinened;
    relative.strikeThrough = relative.strikeThrough
      ? relative.strikeThrough
      : informant.strikeThrough;
    relative.color = relative.color ? relative.color : informant.color;
  };

  console.log(100);
  let banned = []; // store parts of family that are no longer needed
  let memberCount = 0;

  // detect and inform twins
  family.forEach((member, index) => {
    if (banned.includes(member)) return;
    family[index].id = memberCount;
    memberCount += 1;
    // find twins
    const twins = family.filter(
      relative =>
        relative.begin === member.begin &&
        relative.end === member.end &&
        relative !== member
    );
    twins.forEach(twin => {
      // extract twins information
      informRelative(member, twin);
      // ban twins as they are no longer needed
      banned.push(twin);
    });
  });

  const reducedFamily = family.filter(member => !banned.includes(member)); // exclude banned twins
  const strangeRelatives = []; // store strange relatives to later inspect

  // find children and strange relatives
  reducedFamily.forEach((member, index) => {
    console.log('......');
    // find descendants in family
    const descendants = reducedFamily.filter(
      relative =>
        relative.begin >= member.begin &&
        relative.end <= member.end &&
        relative.id !== member.id
    );
    // find direct children in descendants
    descendants.forEach(descendant => {
      if (
        descendants.filter(
          possibleParent =>
            possibleParent.begin <= descendant.begin &&
            possibleParent.end >= descendant.end &&
            possibleParent.id !== descendant.id
        ).length > 0
      ) {
        return; // descendant is not a direct child
      }
      // inform parent and child about connection
      reducedFamily[
        reducedFamily.findIndex(relative => relative.id === descendant.id)
      ].parents.push(member.id);
      reducedFamily[index].children.push(descendant.id);
    });

    // find relatives you dont really know where to put, as they overlap only partly
    const newStrangeRelatives = reducedFamily.filter(
      relative =>
        relative.begin > member.begin &&
        relative.begin <= member.end &&
        relative.end > member.end
      // !strangeRelatives.includes(relative)
    );
    console.log('newStrangeRelatives');
    console.log(newStrangeRelatives);
    if (newStrangeRelatives.length > 0) {
      strangeRelatives.push(member, ...newStrangeRelatives); //2do handle possible duplicates.
    }
  });

  console.log(300);
  console.log(strangeRelatives);
  console.log(310);

  const divides = [
    ...new Set(
      strangeRelatives
        .map(strangeRelative => [strangeRelative.begin, strangeRelative.end])
        .flat(1)
    )
  ];
  divides.sort((a, b) => a - b); // sort ascending

  console.log(390);
  console.log(divides);
  console.log(400);
  const patchworkFamily = [...reducedFamily];
  for (let i = 0; i < divides.length; i++) {
    console.log(410);
    if (i === 0) continue; // if first intersection or repeated

    const concernedRelatives = patchworkFamily.filter(
      relative =>
        // case: starts at and ends after // this excluds childs // maybe one can find all relevant case in strange relatives instead of searching whole family?
        divides[i - 1] === relative.begin && divides[i] < relative.end
    );

    console.log(concernedRelatives);

    if (concernedRelatives.length > 0) {
      const adjustment = strangeRelatives.some(
        strangeRelative => strangeRelative.begin === divides[i]
      )
        ? 1
        : 0;
      console.log('adjustment');
      console.log(adjustment);
      const dividedReleative = {
        ...standardFamilyMember,
        id: 'dividedRelative_' + divides[i - 1] + '_to_' + divides[i],
        begin: divides[i - 1],
        end: divides[i] - adjustment //what if there is only confilct between [i-2]&[i-1] AND [i]&[i+1]
        // 2do it seems like there is a problem.
        // at some times end should be divides[i]-1
        // at other times divides[i]-0
        // it seems that -1 should be done if coonflicting party is added on
        // it seems that 0 shoud be done if next one does not contains a conflict
      };

      // swallow new twins from children
      const twins = patchworkFamily.filter(
        relative =>
          relative.begin === dividedReleative.begin &&
          relative.end === dividedReleative.end &&
          // and not a concerened relative
          !concernedRelatives
            .map(concernedRelative => concernedRelative.id)
            .includes(relative.id)
      );

      twins.forEach(twin => {
        // extract twins information
        informRelative(dividedReleative, twin);
        // splice twins out of family
        patchworkFamily.splice(
          patchworkFamily.findIndex(relative => relative.id === twin.id),
          1
        );
      });

      dividedReleative.children = dividedReleative.children.filter(
        child => child.begin >= divides[i - 1] && child.end < divides[i]
      );
      concernedRelatives.forEach(concernedRelative => {
        informRelative(dividedReleative, concernedRelative);
        // does remainder need to be updated, as its beeing updataed anyways int the next go
        const remainingRelative = {
          ...concernedRelative,
          begin: divides[i],
          id: concernedRelative.id + '_2'
        };

        // update childrens parent referece
        console.log('cRchilds', concernedRelative.children);
        remainingRelative.children = remainingRelative.children.filter(
          child => child.begin >= divides[i]
        );

        concernedRelative.children.forEach(child => {
          const keepChild = child.begin >= divides[i] ? true : false;
          const childIndex = patchworkFamily.findIndex(
            relative => relative.id === child
          );
          console.log(
            'child upate ',
            patchworkFamily[childIndex],
            'with ',
            child.begin
              ? [dividedReleative.id, remainingRelative.id]
              : dividedReleative.id
          );
          if (keepChild) {
            patchworkFamily[childIndex].parents.splice(
              patchworkFamily[childIndex].parents.indexOf(concernedRelative.id),
              1,
              dividedReleative.id,
              remainingRelative.id
            );
          } else {
            const childIndex = patchworkFamily.findIndex(
              relative => relative.id === child
            );
            patchworkFamily[childIndex].parents.splice(
              patchworkFamily[childIndex].parents.indexOf(concernedRelative.id),
              1,
              dividedReleative.id
            );
            remainingRelative.children = remainingRelative.children.filter(
              nephew => nephew !== child
            );
          }
        });

        // update parents child referece
        console.log('cRparents', concernedRelative.parents);
        concernedRelative.parents.forEach(parent => {
          console.log('cRp', concernedRelative.parents);
          const parentIndex = patchworkFamily.findIndex(
            relative => relative.id === parent
          );
          console.log('pI', parentIndex);
          patchworkFamily[parentIndex].children.splice(
            patchworkFamily[parentIndex].children.indexOf(concernedRelative.id),
            1,
            dividedReleative.id,
            remainingRelative.id
          );
        });

        // replace concernedRelative with its Rrmainder
        patchworkFamily.splice(
          patchworkFamily.findIndex(
            relative => relative.id === concernedRelative.id
          ),
          1,
          remainingRelative
        );
      });

      //  what happens if childs are now the same as dividedRelative?
      dividedReleative.children = dividedReleative.children.filter(
        child => child.end < divide[i]
      );
      patchworkFamily.push(dividedReleative);
    }
  }

  console.log('patchworkFamily');
  console.log(patchworkFamily);
  console.log(500);
  // check out what ranges are not included in any of the familyMemberRanges
  const ancestors = patchworkFamily.filter(
    member => member.parents.length === 0
  );
  1;
  console.log('ancestors');
  console.log(ancestors);

  const ancestorLines = ancestors.map(member => {
    return { begin: member.begin, end: member.end };
  });
  ancestorLines.sort((a, b) =>
    a.begin !== b.begin ? a.begin - b.begin : a.end - b.end
  );

  console.log('ancestorLines');
  console.log(ancestorLines);
  // 2do: 1st one missing.... e.g. 0-10
  for (let i = 0; i < ancestorLines.length; i++) {
    if (i === 0 && ancestorLines[i].begin > 0) {
      patchworkFamily.push({
        ...standardFamilyMember,
        id: `_0_____${ancestorLines[i].begin - 1}_`,
        begin: 0,
        end: ancestorLines[i].begin - 1
      });
    }
    if (i !== 0) {
      if (ancestorLines[i].begin - ancestorLines[i - 1].end > 1) {
        patchworkFamily.push({
          ...standardFamilyMember,
          id: `_${ancestorLines[i - 1].end + 1}_____${
            ancestorLines[i].begin - 1
          }_`,
          begin: ancestorLines[i - 1].end + 1,
          end: ancestorLines[i].begin - 1
        });
      }
    }
    if (
      i === ancestorLines.length - 1 &&
      ancestorLines[i].end < textcontent.length
    ) {
      patchworkFamily.push({
        ...standardFamilyMember,
        id: `_${ancestorLines[i].end + 1}_____${textcontent.length - 1}_`,
        begin: ancestorLines[i].end + 1,
        end: textcontent.length - 1
      });
    }
  }

  const happyFamilyPhoto = patchworkFamily.map(member => {
    return {
      ...member,
      textcontent: textcontent.slice(member.begin, member.end + 1)
    };
  });
  happyFamilyPhoto.sort((a, b) =>
    a.begin !== b.begin ? a.begin - b.begin : a.end - b.end
  );
  return happyFamilyPhoto;
};

const textspans = [
  {
    begin: 10,
    end: 20,
    sectionIds: [],
    categoryIds: [],
    div: 'h2',
    bold: null,
    underlinened: null,
    strikeThrough: null,
    color: ''
  }
];
const sectionsById = {
  sec_wrapper: {
    _id: 'sec_wrapper',
    categoryId: 'Assumption_101',
    begin: 5,
    end: 25
  },
  stanger1: {
    _id: 'stanger1',
    categoryId: 'Assumption_202',
    begin: 35,
    end: 45
  },
  stanger2: {
    _id: 'stanger2',
    categoryId: 'Assumption_101',
    begin: 40,
    end: 48
  },
  sec_456: {
    _id: 'sec_456',
    categoryId: 'Result_101',
    begin: 51,
    end: 55
  },
  sec_789: {
    _id: 'sec_789',
    categoryId: 'Method_101',
    begin: 51,
    end: 55
  },
  weird1: {
    _id: 'weird1',
    categoryId: 'Method_101',
    begin: 100,
    end: 140
  },
  weird2: {
    _id: 'weird2',
    categoryId: 'RES',
    begin: 120,
    end: 150
  },
  child1: {
    _id: 'child1',
    categoryId: 'Child1',
    begin: 130,
    end: 145
  }
};
const textcontent =
  'Let me paste some plain text here and there. This should just mimic a Text. And I keep on writing because it is important to me that this text finally works. If it works I might post the solution on stack overflow. But maybe I will be to lazy for that. I think that should be enough text for now.';
// textcontent.length = 296
console.log(
  '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
  spansByIdCreator(textcontent, textspans, sectionsById)
);
