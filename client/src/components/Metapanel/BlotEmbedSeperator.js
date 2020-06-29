import ReactQuill from 'react-quill';
let Inline = ReactQuill.Quill.import('blots/inline');

export default class BlotEmbedSeperator extends Inline {
  constructor(domNode) {
    super(domNode);
  }

  static create(value) {
    let node = super.create();
    node.setAttribute('data-case', value.case); // begin|| end
    node.setAttribute('data-embed-type', value.embedType); // note | section(quote) | annotation
    node.setAttribute('data-res-id', value.resId);
    node.setAttribute('data-res-info', value.resInfo);
    node.setAttribute('data-is-open', value.isOpen);
    node.setAttribute('class', `embedSeperator case-${value.case}`);
    return node;
  }
  static value(node) {
    return {
      case: node.getAttribute('data-case'),
      embedType: node.getAttribute('data-embed-type'),
      resId: node.getAttribute('data-res-id'),
      resInfo: node.getAttribute('data-res-info'),
      isOpen: node.getAttribute('data-is-open'),
      className: node.getAttribute('class')
    };
  }
  static formats(node) {
    return {
      case: node.getAttribute('data-case'),
      embedType: node.getAttribute('data-embed-type'),
      resId: node.getAttribute('data-res-id'),
      resInfo: node.getAttribute('data-res-info'),
      isOpen: node.getAttribute('data-is-open'),
      className: node.getAttribute('class')
    };
  }

  static blotName = 'embedSeperator';
  static tagName = 'hr';
  // static className = `embedSeperator`;
}
