import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addSectionCategory,
  removeSectionCategory
} from '../../../../../../store/actions';
import { BsBookmark, BsX, BsXCircle, BsPlus } from 'react-icons/bs';

const SectionCategories = ({ sectionId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const [addingCategory, _setAddingCategory] = useState(false);
  const setAddingCategory = val => {
    _setAddingCategory(val);
    triggerRemeasure();
  };
  const categories = useSelector(s => s.categories);
  const sectionCategoryIds = useSelector(
    s => s.sections[sectionId].categoryIds
  );

  const onCategoryChangeHandler = e => {
    dispatch(addSectionCategory(sectionId, e.target.value));
    setAddingCategory(false);
  };

  const removeCategory = id => {
    dispatch(removeSectionCategory(sectionId, id));
    // handle case where there is no category left.
  };
  return (
    <div>
      <span>Categories: </span>{' '}
      {sectionCategoryIds.map(id => (
        <div
          key={`sectionCategoryIds-${id}`}
          className='section-attribute section-categories-preview'
        >
          <div
            className='remove-section-attribute'
            onClick={() => removeCategory(id)}
          >
            <BsXCircle />
          </div>
          {categories.byId[id].title}
        </div>
      ))}
      {addingCategory ? (
        <div className='input-group input-group-sm mb-2'>
          <div className='input-group-prepend' id={`${sectionId}_secCatSelect`}>
            <span className='input-group-text'>
              <BsBookmark />
            </span>
          </div>
          <select
            className='form-control custom-select white-opacity-50'
            value={sectionCategoryIds[0]}
            onChange={onCategoryChangeHandler}
          >
            <option key={'- select -'} value='- select -'>
              - select -
            </option>
            {Object.keys(categories.byId)
              .filter(id => !sectionCategoryIds.includes(id))
              .map(id => (
                <option key={id} value={id}>
                  {categories.byId[id].title}
                </option>
              ))}
          </select>
          <div className='input-group-prepend' id={`${sectionId}_secCatSelect`}>
            <button
              className='input-group-text btn-light'
              onClick={() => setAddingCategory(false)}
            >
              <BsX />
            </button>
          </div>
        </div>
      ) : (
        <button
          className='btn btn-sm btn-light'
          onClick={() => setAddingCategory(true)}
        >
          <BsPlus />
        </button>
      )}
    </div>
  );
};

export default SectionCategories;
