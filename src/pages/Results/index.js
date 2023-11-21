import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import './results.css';
import { deleteFilter, getPosts } from '../../features/filterSlice';

const Results = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter.value);
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const renderedFilters = filters.map((f) => (
    <article key={f.id}>
      <Typography className="content">
        id:
        {' '}
        {f.id}
        {' '}
        title:
        {f.title}
        {' '}
        content:
        {f.content.substring(0, 100)}
      </Typography>
      <button
        type="button"
        onClick={() => {
          dispatch(
            deleteFilter({
              id: f.id,
            }),
          );
        }}
      >
        X
      </button>
    </article>
  ));

  return (
    <section>
      <Typography variant="h2">Posts</Typography>
      {renderedFilters}
    </section>
  );
};

export default Results;
