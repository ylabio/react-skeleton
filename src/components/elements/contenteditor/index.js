import React from 'react';
import PropTypes from 'prop-types';

function findLastTextNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node;
  let children = node.childNodes;
  for (let i = children.length - 1; i >= 0; i--) {
    let textNode = findLastTextNode(children[i]);
    if (textNode !== null) return textNode;
  }
  return null;
}

export default class ContentEditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.string,
  };

  static defaultProps = {
    onChange: () => {},
    data: '',
  };

  componentDidUpdate() {
    this.replaceCaret(this.ref);
  }

  replaceCaret(el) {
    const target = findLastTextNode(el);
    const isTargetFocused = document.activeElement === el;
    if (target && target.nodeValue && isTargetFocused) {
      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart(target, this.pos);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  getCaretPosition = editableDiv => {
    let caretPos = 0,
      sel,
      range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode === editableDiv) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() === editableDiv) {
        const tempEl = document.createElement('span');
        editableDiv.insertBefore(tempEl, editableDiv.firstChild);
        const tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint('EndToEnd', range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  };

  emitChange = () => {
    const html = this.ref.innerHTML;
    this.pos = this.getCaretPosition(this.ref);
    this.props.onChange(html);
  };

  render() {
    return (
      <div
        ref={node => (this.ref = node)}
        dangerouslySetInnerHTML={{ __html: this.props.data }}
        contentEditable="true"
        onInput={this.emitChange}
      />
    );
  }
}
