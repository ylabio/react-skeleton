import React from 'react';
import EditableInput from './editable-input';

import './style.less';

const EditableText = React.memo(({isEdit, text, editText, errors, onSave, onClick}) => {
    if(isEdit){
        return (<EditableInput 
            title={editText}
            errors={errors}
            onSave={onSave}
        />);
    }
    return (<span className="EditableText" onClick={onClick}>{text}</span>);
});

export default EditableText;
