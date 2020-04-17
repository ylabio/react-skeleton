import React, { useCallback, useState, useEffect } from 'react';
import ssrPlaceholder from "@utils/ssr-placeholder";
import Tree from '@components/elements/tree';
import useSelectorMap from "@utils/use-selector-map";
import Error from '@components/elements/error';
import EditableText from '@components/elements/editable-text';
import * as actions from "@store/actions";

const CategoryEditTree = React.memo(ssrPlaceholder(
    (props) => {
        const select = useSelectorMap(state => ({
            roots: state.categories.roots,
            wait: state.categories.wait,
            errors: state.categories.errors,
            changing: state.categories.changing,
            changingErrors: state.categories.changingErrors,
        }));

        const [editCategory, setEditCategory] = useState(null);
        const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);

        const onCategoryClick = useCallback((item)=> () => setEditCategory(item), [setEditCategory]);

        const onCategoryItemTitleChange = useCallback((title) => {
            if(editCategory.title != title) {
                actions.categories.changeTitle({
                    id: editCategory._id,
                    title,
                });
                setIsCategoryUpdating(true);
            } else {
                setEditCategory(null);
                setIsCategoryUpdating(false);
            } 
        }, [editCategory]);

        useEffect(() => {
            if(isCategoryUpdating && editCategory && !select.changing && !select.changingErrors){
                setEditCategory(null);
                setIsCategoryUpdating(false);
            }
        }, [isCategoryUpdating, editCategory, select])

        if (select.wait) {
            return <div>{select.wait && (<i>Загрузка...</i>)}</div>
        } else {
            return (
                <>
                    <Tree items={select.roots}
                        renderItem={item =>
                            <EditableText 
                                isEdit={editCategory === item}
                                text={item._key + ' ' + item.title}
                                editText={editCategory?.title}
                                errors={select.changingErrors}
                                onClick={onCategoryClick(item)}
                                onSave={onCategoryItemTitleChange}
                            />
                        }/>
                    { select.errors && select.errors.length > 0 && <Error errors={select.errors} /> }
                </>
            );
        }
    },
    (props) => {
        return (
        <div>Здесь список категорий</div>
        )
    }
));

export default CategoryEditTree;