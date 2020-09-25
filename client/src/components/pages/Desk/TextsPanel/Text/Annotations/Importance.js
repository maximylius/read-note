import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsStarFill, BsStar, BsStarHalf } from 'react-icons/bs';
import { setSectionWeight } from '../../../../../../store/actions';

const roundToHalf = num => {
  return Math.round(num * 2) / 2;
};
const calcStars = e => {
  const divRect = e.currentTarget.getBoundingClientRect();
  return roundToHalf((5 * (e.screenX - divRect.left)) / divRect.width);
};

const Importance = ({ sectionId, preview }) => {
  const dispatch = useDispatch();
  const userId = useSelector(s => s.user._id);
  const importance = useSelector(s => s.sections[sectionId].importance);
  const personalImportance = importance.some(el => el.userId === userId);
  const personalScore =
    (personalImportance || 0) &&
    importance.find(el => el.userId === userId).score;
  const importanceScore = importance.reduce((a, b) => a + b.score, 0);
  const [mouseIsOver, setMouseIsOver] = React.useState(false);
  const [tentativeScore, setTentativeScore] = useState(0);

  const mouseEnterHandler = () => {
    setMouseIsOver(true);
  };
  const mouseLeaveHandler = () => {
    setMouseIsOver(false);
  };
  const mouseMoveHandler = e => {
    if (!mouseIsOver) return;
    setTentativeScore(calcStars(e));
  };

  const setImportanceRating = value => {
    dispatch(setSectionWeight(sectionId, value));
    console.log('new score', value);
  };

  const score = mouseIsOver ? tentativeScore : importanceScore;

  const mapScoreStars = [0, 1, 2, 3, 4].map(count =>
    score > count + 0.5 ? (
      <BsStarFill key={sectionId + 'rating' + count} />
    ) : score <= count ? (
      <BsStar key={sectionId + 'rating' + count} />
    ) : (
      <BsStarHalf key={sectionId + 'rating' + count} />
    )
  );

  if (preview) {
    if (!personalImportance) return <></>;
    return (
      <span
        className={`section-attribute importance-rating-preview ${
          personalImportance ? 'personal-importance' : ''
        }`}
      >
        {importanceScore < 0 ? (
          <span>
            z
            <sup>
              z<sup>z</sup>
            </sup>
            {'   '}
          </span>
        ) : (
          <span className='importance-rating-stars'>{mapScoreStars}</span>
        )}
      </span>
    );
  }

  return (
    <>
      <span>Importance: </span>
      <div
        className={`section-attribute importance-rating${
          mouseIsOver ? '' : '-preview'
        } ${personalImportance ? 'personal-importance' : ''}`}
      >
        <span
          className={`${
            personalScore < 0 ? 'rated' : 'not-rated'
          } importance-rating-sleep`}
          onClick={() => setImportanceRating(-3)}
        >
          z
          <sup>
            z<sup>z</sup>
          </sup>
        </span>
        <div
          className={`${
            personalScore >= 0 ? 'rated' : 'not-rated'
          } importance-rating-stars`}
          onClick={e => setImportanceRating(calcStars(e))}
          onMouseEnter={mouseEnterHandler}
          onMouseLeave={mouseLeaveHandler}
          onMouseMove={mouseMoveHandler}
        >
          {mapScoreStars}
        </div>
      </div>
    </>
  );
};

export default Importance;
