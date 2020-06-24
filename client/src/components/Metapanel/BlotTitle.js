import ReactQuill from 'react-quill';
let Block = ReactQuill.Quill.import('blots/block');

export default class BlotTitle extends Block {
  constructor(domNode) {
    super(domNode);
  }

  static create(value) {
    let node = super.create();
    node.setAttribute('data-case', value.case); // begin|| end
    node.setAttribute('data-embed-type', value.embedType); // note | section(quote) | annotation
    node.setAttribute('data-id', value.id);
    node.setAttribute('data-id-path', value.idPath);
    node.setAttribute('data-is-open', value.isOpen);
    node.setAttribute('class', `embedSeperator case-${value.case}`);
    return node;
  }
  static value(node) {
    return {
      case: node.getAttribute('data-case'),
      embedType: node.getAttribute('data-embed-type'),
      id: node.getAttribute('data-id'),
      idPath: node.getAttribute('data-id-path'),
      isOpen: node.getAttribute('data-is-open'),
      className: node.getAttribute('class')
    };
  }
  static formats(node) {
    return {
      case: node.getAttribute('data-case'),
      embedType: node.getAttribute('data-embed-type'),
      id: node.getAttribute('data-id'),
      idPath: node.getAttribute('data-id-path'),
      isOpen: node.getAttribute('data-is-open'),
      className: node.getAttribute('class')
    };
  }

  static blotName = 'noteTitle';
  static tagName = 'h1';
  static className = `noteTitle`;
}
