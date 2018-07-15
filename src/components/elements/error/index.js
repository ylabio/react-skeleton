/**
 * Вывод ошибки из общего массива ошибок
 * У каждой ошибки ожидайется ключ, соответсвующий пути на свойство модели, например "profile.name"
 * Компонент выводит ошибку, если по указанному ключу есть ошибка в общем массиве ошибок
 * @todo Вместо массива ошибок использовать объект, чтобы оптимизироват поиск
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class Error extends Component {

  static propTypes = {
    errors: PropTypes.any,
    path: PropTypes.string
  };

  renderItems() {
    const path = this.props.path;
    if (!this.props.errors && !(this.props.errors instanceof Array) && !(this.props.errors instanceof Object)) {
      return null;
    }
    let errors = this.props.errors instanceof Array ? this.props.errors : [this.props.errors];
    const items = [];

    errors.map(item => {
      if (!item || !item.message) {
        return;
      }

      if ((item.path && item.path.indexOf(path) === 0 && path.length > 0) ||
        (item.path.length === 0 && path.length === 0) ||
        (!item.path && !path)) {
        items.push((
          <div key={item.code} className="Error__item">
            {item.message}
          </div>
        ));
      }

    });
    return items;
  }

  render() {
    return (
      <div className="Error">
        {React.Children.toArray(this.renderItems())}
      </div>
    );
  }
}
