import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFilter } from "./filterSlice";
const AddFilterForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const filters = useSelector(state => state.filter.value);
    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const dispatch = useDispatch()
    return (
        <section>
            <h2>Add a new post</h2>
            <form>
                <label htmlFor="postTitle">Post title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                >
                </input>
                <label htmlFor="postContent">Post content:</label>
                <input
                    type="text"
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                >
                </input>
            </form>
            <button onClick={() => {
                dispatch(addFilter({
                    id: filters[filters.length - 1].id + 1, 
                    title: title, 
                    content: content
                }))
            }}>Submit</button>
        </section>
    )
}
export default AddFilterForm;