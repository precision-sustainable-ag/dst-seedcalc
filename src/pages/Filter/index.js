import { useState } from "react";
import Grid from "@mui/material/Grid"; 
import { useSelector, useDispatch } from "react-redux";
import { Header } from "./../../components/Header";
import { addFilter } from "./../../features/filter/filterSlice";
import Button from '@mui/material/Button';

const Filter = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const filters = useSelector(state => state.filter.value);
    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const dispatch = useDispatch()
    return (
        <Grid>
            <Header 
                type="home"
                headerClass="dst-header-home"
                text="Seeding Rate Calculator"
                size={12}
            />     
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
            <Button 
                variant="contained"
                onClick={() => {
                    dispatch(addFilter({
                        id: filters[filters.length - 1].id + 1, 
                        title: title, 
                        content: content
                    }))
            }}>Submit</Button>
        </Grid>
    )
}
export default Filter;