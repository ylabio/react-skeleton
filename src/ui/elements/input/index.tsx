import React, {memo, useCallback, useLayoutEffect, useState} from 'react';
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';
import './style.less';

interface Props {
  value: string,
  name: string,
  onChange: (value: string, name: string) => void,
  type?: string,
  placeholder?: string,
  size?: 'big',
}

function Input(props: Props) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), 600),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChangeDebounce(e.target.value);
  };

  // Обновление стейта, если передан новый value
  if (!import.meta.env.SSR) {
    useLayoutEffect(() => setValue(props.value), [props.value]);
  }

  const cn = bem('Input');
  return (
    <input
      className={cn({size: props.size})}
      value={value}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      onChange={onChange}
    />
  );
}

export default memo(Input);
