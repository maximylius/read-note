import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCommittedSections,
  setTentativeSections
} from '../../../../../store/actions';
import { extractNumber } from '../../../../../functions/main';

const TextSpan = ({
  attr: {
    textcontent,
    color,
    fontWeight,
    fontStyle,
    textDecoration,
    sectionIds,
    categoryIds,
    id
  }
}) => {
  const dispatch = useDispatch();
  const {
    categories,
    textsPanel: { committedSectionIds, tentativeSectionIds, holdControl }
  } = useSelector(state => state);
  const [low, std, high] = [0.3, 0.7, 1];

  let backgroundColor;

  if (categoryIds.length > 0) {
    const committedToSection = committedSectionIds.some(id =>
      sectionIds.includes(id)
    )
      ? true
      : false;
    const tentativeToSection = tentativeSectionIds.some(id =>
      sectionIds.includes(id)
    )
      ? true
      : false;

    const occupancy =
      committedSectionIds.length === 0
        ? tentativeToSection
          ? high
          : std
        : committedToSection
        ? high
        : tentativeToSection
        ? std
        : low;

    const r = categoryIds
      .map(categoryId => extractNumber(categories.byId[categoryId].rgbColor, 0))
      .reduce((pv, cv) => pv + cv, 0);
    const g = categoryIds
      .map(categoryId => extractNumber(categories.byId[categoryId].rgbColor, 1))
      .reduce((pv, cv) => pv + cv, 0);
    const b = categoryIds
      .map(categoryId => extractNumber(categories.byId[categoryId].rgbColor, 2))
      .reduce((pv, cv) => pv + cv, 0);

    backgroundColor = `rgb(${r / categoryIds.length},${
      g / categoryIds.length
    },${b / categoryIds.length},${occupancy})`;
  }

  const onClickHandler = () => {
    dispatch(setCommittedSections(sectionIds, holdControl));
  };

  const onMouseEnterHandler = () => {
    if (
      holdControl !== true &&
      !tentativeSectionIds.some(id => sectionIds.includes(id))
    ) {
      dispatch(setTentativeSections(sectionIds, holdControl));
    }
  };

  const onMouseLeaveHandler = () => {
    if (holdControl !== true) {
      dispatch(setTentativeSections([], false));
    }
  };

  return (
    <span
      id={id}
      style={{
        ...(backgroundColor && { backgroundColor }),
        ...(color && { color: color }),
        ...(textDecoration && { textDecoration }),
        ...(fontWeight && { fontWeight })
      }}
      {...(sectionIds.length > 0 && {
        onClick: onClickHandler,
        onMouseEnter: onMouseEnterHandler,
        onMouseLeave: onMouseLeaveHandler
      })}
    >
      {textcontent}
    </span>
  );
};

export default TextSpan;
