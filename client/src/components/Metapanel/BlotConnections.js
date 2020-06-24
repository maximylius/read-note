import ReactQuill from 'react-quill';
let Inline = ReactQuill.Quill.import('blots/inline');

// dont allow formatting
// make embeded blot as you dont need to interact with it
export default class BlotConnections extends Inline {
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

  static blotName = 'connectedWith';
  static tagName = 'span';
  static className = `connectedWith`;
}
