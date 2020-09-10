const marginBottom = 5;

const calcAllFinalPositions = (sectionsToDisplay, bestPositions) => {
  // const sectionsContainer = document.getElementById('sectionsContainer');
  // const sectionsNodeList = sectionsContainer
  //   ? [...sectionsContainer.children]
  //   : [];
  // const quillTextPanel = document.getElementById('quillTextPanel');
  // const adjustTop =
  //   (quillTextPanel &&
  //     quillTextPanel.getBoundingClientRect().top - 1.25 * 16) || //2do? adjust with scroll?
  //   0;

  const finalPositions = {};
  sectionsToDisplay.forEach((id, index) => {
    // const sectionNode = sectionsNodeList.find(el => el.id.includes(id));
    // console.log(
    //   'sectionNode',
    //   sectionNode && sectionNode.getBoundingClientRect()
    // );
    // bestPositions[id] = {
    //   ...bestPositions[id],
    //   height_section:
    //     (sectionNode && sectionNode.getBoundingClientRect().height) || 40,
    //   bottom_section:
    //     (sectionNode &&
    //       sectionNode.getBoundingClientRect().bottom - adjustTop) ||
    //     bestPositions[id].top + 40,
    //   right_section:
    //     (sectionNode && sectionNode.getBoundingClientRect().right) || 800,
    //   left_section:
    //     (sectionNode && sectionNode.getBoundingClientRect().left) || 100
    // };

    let positionTop = bestPositions[id].top_text;
    if (index > 0) {
      const lastId = sectionsToDisplay[index - 1];
      finalPositions[lastId].freeSpaceBottom =
        finalPositions[lastId].top_section - positionTop - marginBottom;
      const positionBottomAbove =
        finalPositions[lastId].top_section +
        bestPositions[lastId].height_section;

      if (positionBottomAbove >= positionTop) {
        positionTop = positionBottomAbove + marginBottom;
      }
    }
    finalPositions[id] = {
      top_section: positionTop,
      bottom_section: positionTop + bestPositions[id].height_section,
      right_section: bestPositions[id].right_section,
      left_section: bestPositions[id].left_section,
      freeSpaceBottom: 10000,
      top_text: bestPositions[id].top_text,
      bottom_text: bestPositions[id].bottom_text
    };
  });
  console.log('finalPositions', finalPositions);
  return finalPositions;
};

export default calcAllFinalPositions;

// 2do: specific positions doesnt work yet: stops one after the intial: doesnt push other down further if needed. also doesnt pull back up when space is available. // is this performance boost even necessary?...
// const calcSpecificFinalPositions = (
//   sectionIndex,
//   sectionsToDisplay,
//   bestPositions,
//   finalPositions
// ) => {
//   let i = sectionIndex + 0;
//   // let i = sectionIndex + 1;
//   console.log('statz while loop');
//   while (i < sectionsToDisplay.length) {
//     const id = sectionsToDisplay[i];
//     let positionTop = bestPositions[id].top;
//     if (i > 0) {
//       const lastId = sectionsToDisplay[i - 1];
//       finalPositions[lastId].freeSpaceBottom =
//         finalPositions[lastId].top - positionTop - marginBottom;
//       if (finalPositions[lastId].freeSpaceBottom > 0) break; //you can break here as it is pushed down no further.
//       const positionBottomAbove =
//         finalPositions[lastId].top + bestPositions[lastId].height;

//       if (positionBottomAbove >= positionTop) {
//         positionTop = positionBottomAbove + marginBottom;
//       }
//     }

//     finalPositions[id] = {
//       top: positionTop,
//       freeSpaceBottom: 10000
//     };
//     i++;
//   }
//   console.log('end while loop');

//   return finalPositions;
// };
