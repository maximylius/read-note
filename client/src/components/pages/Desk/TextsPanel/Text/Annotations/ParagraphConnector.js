import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTentativeSections,
  setCommittedSections
} from '../../../../../../store/actions';

const ParagraphConnector = ({
  sectionId,
  top_text,
  bottom_text,
  top_section,
  left,
  right,
  bottom_section,
  color,
  active
}) => {
  const dispatch = useDispatch();
  // event handlers
  const sectionItemClickHandler = e => {
    dispatch(setCommittedSections([sectionId], false));
  };
  const sectionItemOnMouseEnterHandler = () =>
    dispatch(setTentativeSections([sectionId], false));

  return (
    <polygon
      className='paragraph-connector'
      onClick={sectionItemClickHandler}
      onMouseEnter={sectionItemOnMouseEnterHandler}
      points={`${left}, ${top_text} ${right}, ${top_section}  ${right}, ${bottom_section} ${left}, ${bottom_text} `}
      fill={`rgb(${color},${active ? '0.7' : '0.2'})`}
      stroke={`rgb(${color})`}
    ></polygon>
  );
};

export default ParagraphConnector;
