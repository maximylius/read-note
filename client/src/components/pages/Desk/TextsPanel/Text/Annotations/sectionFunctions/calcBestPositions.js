const calcBestPositions = sectionsToDisplay => {
  // 2do maybe sectionsToDisplay needs to be sorted according to px position.
  const quillTextPanel = document.getElementById('quillTextPanel');
  const textSectionsNodeList = quillTextPanel
    ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
    : [];

  const sectionsContainer = document.getElementById('sectionsContainer');
  const sectionsNodeList = sectionsContainer
    ? [...sectionsContainer.children]
    : [];
  console.log('textSectionsNodeList', textSectionsNodeList);
  console.log('sectionsNodeList', sectionsNodeList);
  const adjustTop =
    (quillTextPanel &&
      quillTextPanel.getBoundingClientRect().top - 1.25 * 16) || //2do? adjust with scroll?
    0;

  const bestPositions = {};
  sectionsToDisplay.forEach((id, index) => {
    const firstIndex = textSectionsNodeList.findIndex(el =>
      el.dataset.sectionIds.includes(id)
    );
    const lastIndex =
      textSectionsNodeList.length -
      1 -
      [...textSectionsNodeList]
        .reverse()
        .findIndex(el => el.dataset.sectionIds.includes(id));
    const lastId = sectionsToDisplay[index - 1];
    bestPositions[id] =
      firstIndex < 0
        ? {
            top_text: bestPositions[lastId]
              ? bestPositions[lastId].top_text + 100
              : 80,
            bottom_text: bestPositions[lastId]
              ? bestPositions[lastId].bottom_text + 100
              : 120
          }
        : {
            top_text:
              textSectionsNodeList[firstIndex].getBoundingClientRect().top -
              adjustTop,
            bottom_text:
              textSectionsNodeList[lastIndex].getBoundingClientRect().bottom -
              adjustTop
          };

    const sectionNode = sectionsNodeList.filter(el => el.id.includes(id))[0];
    console.log(
      'sectionNode',
      sectionNode && sectionNode.getBoundingClientRect()
    );
    bestPositions[id] = {
      ...bestPositions[id],
      height_section:
        (sectionNode && sectionNode.getBoundingClientRect().height) || 70,
      bottom_section:
        (sectionNode &&
          sectionNode.getBoundingClientRect().bottom - adjustTop) ||
        bestPositions[id].top + 70,
      right_section:
        (sectionNode && sectionNode.getBoundingClientRect().right) || 900,
      left_section:
        (sectionNode && sectionNode.getBoundingClientRect().left) || 550
    };
  });
  console.log('bestPositions', bestPositions);
  return bestPositions;
};

export default calcBestPositions;
