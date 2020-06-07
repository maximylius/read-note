import ReactQuill from 'react-quill';
let Inline = ReactQuill.Quill.import('blots/inline');

export default class SectionBlot extends Inline {
  constructor(domNode) {
    super(domNode);
  }

  static create(value) {
    let node = super.create();
    node.setAttribute('data-section-ids', value.sectionIds.join(','));
    node.setAttribute('data-text-id', value.textId);
    node.setAttribute('data-category-ids', value.categoryIds.join(','));
    node.setAttribute(
      'style',
      `
      border-bottom: 2px solid ${value.borderColor}; 
      background-color: ${value.backgroundColor}; 
      padding-top: 0.05rem; 
      padding-bottom: 0.05rem;
      `
      // ${value.first ? `border-left: 2px solid ${value.borderColor};` : ''}
      // ${value.last ? `border-right: 2px solid ${value.borderColor};` : ''}
      // `background-color: rgb(${value.backgroundColor});`
      // color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 1.15s ease-in-out, box-shadow 0.15s ease-in-out
    );
    return node;
  }
  static value(node) {
    return {
      sectionIds: node.getAttribute('data-section-ids'),
      textId: node.getAttribute('data-text-id'),
      categoryIds: node.getAttribute('data-category-ids'),
      style: node.getAttribute('style')
    };
  }
  static formats(node) {
    return {
      sectionIds: node.getAttribute('data-section-ids'),
      textId: node.getAttribute('data-text-id'),
      categoryIds: node.getAttribute('data-category-ids'),
      style: node.getAttribute('style')
    };
  }

  static blotName = 'section';
  static tagName = 'span';
  static className = `TextPanelSectionBlot`;
  // static icon = 'S';
}
