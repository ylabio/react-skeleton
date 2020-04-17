import React, {useState, useCallback} from 'react';
import Input from '@components/elements/input';
import Error from '@components/elements/error';

const EditableInput = React.memo(({title: initialTitle, errors, onSave}) => {

    const [title, setTitle] = useState(initialTitle);

    const onInputChange = useCallback((newTitle) => {
        setTitle(newTitle);
    });
    const onBlur = useCallback(() => {
        onSave(title);
    }, [onSave, title]);

    const onSubmit = useCallback((e) => {
        onBlur();
        e.preventDefault();
    }, [onBlur]);

    return (
        <form onSubmit={onSubmit}>
            <Input 
                value={title} 
                onChange={onInputChange} 
                onBlur={onBlur} 
                required 
                focused 
            />
            <Error errors={errors} path={'title'} />
        </form>
    );
});

export default EditableInput;