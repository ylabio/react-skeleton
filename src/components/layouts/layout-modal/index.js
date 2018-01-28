import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';
import cn from "classnames";

export default class LayoutModal extends Component {

  static propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    footer: PropTypes.node,
    onClose: PropTypes.func,
    toolClose: PropTypes.bool,
    overflowTransparent: PropTypes.bool,
    overflowClose: PropTypes.bool
  };

  static defaultProps = {
    onClose: () => {
    },
    overflowTransparent: false,
    overflowClose: true,
    toolClose: true
  };

  constructor(props) {
    super(props);
    this.modalNode = null;
  }

  componentDidMount() {
    this.autoPosition();
    window.addEventListener("resize", this.autoPosition);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.autoPosition);
  }

  autoPosition = () => {
    let top = 10;
    if (window.innerWidth > this.modalNode.clientHeight) {
      //center
      top = Math.max(top, (window.innerHeight - this.modalNode.clientHeight) / 2 - top);
      //bottom
      //top = window.innerHeight - this.modalNode.clientHeight - top*3;
    }
    this.modalNode.style.marginTop = `${top}px`;
  };

  onClose = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  /**
   * Закрытие окна при клике в серую область
   * @param e
   */
  onCloseOverflow = (e) => {
    if (this.props.overflowClose && e.target.dataset.modal === 'overflow') {
      this.onClose(e);
    }
  };

  render() {
    const {children, header, footer, overflowTransparent, toolClose} = this.props;

    return (
      <div
        data-modal="overflow"
        className={cn("LayoutModalOverflow", {"LayoutModalOverflow_transparent": overflowTransparent})}
        onClick={this.onCloseOverflow}>

        <div className="LayoutModal" ref={ref => this.modalNode = ref}>
          {toolClose ? <a className="LayoutModal__close" href="#" onClick={this.onClose}/> : null}
          <div className="LayoutModal__inner">
            {header ?
              <div className="LayoutModal__header">
                {header}
              </div> : null
            }
            <div className="LayoutModal__content">
              {children}
            </div>
            {footer ?
              <div className="LayoutModal__footer">
                {footer}
              </div> : null
            }
          </div>
        </div>
      </div>
    );
  }
}