import ReactQuill from 'react-quill';
let Inline = ReactQuill.Quill.import('blots/inline');

export default class AnnotationBlot extends Inline {
  constructor(domNode) {
    super(domNode);
  }

  static create(value) {
    let node = super.create();
    node.setAttribute('data-annotation-id', value.annotationId);
    node.setAttribute('data-section-id', value.sectionId);
    node.setAttribute('data-text-id', value.textId);
    node.setAttribute('data-annotation-version', value.version);
    node.setAttribute(
      'style',
      `
    border-bottom: 2px solid ${value.borderColor}; 
    background-color: ${value.backgroundColor}; 
    padding-top: 0.05rem; 
    padding-bottom: 0.05rem;
    `
    );
    return node;
  }
  static value(node) {
    return {
      style: node.getAttribute('style'),
      annotationId: node.getAttribute('data-annotation-id'),
      sectionId: node.getAttribute('data-section-id'),
      textId: node.getAttribute('data-text-id'),
      version: node.getAttribute('data-annotation-version')
    };
  }
  static formats(node) {
    return {
      style: node.getAttribute('style'),
      annotationId: node.getAttribute('data-annotation-id'),
      sectionId: node.getAttribute('data-section-id'),
      textId: node.getAttribute('data-text-id'),
      version: node.getAttribute('data-annotation-version')
    };
  }

  static blotName = 'annotation';
  static tagName = 'span';
  static className = 'QuillEditorAnnotation';
  // static icon = 'A';
}
