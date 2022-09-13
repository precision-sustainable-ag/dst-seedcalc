import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./results.css";
import { deleteFilter, getPosts } from "./../../features/filter/filterSlice";

const Results = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter.value);
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const renderedFilters = filters.map((f, i) => {
    return (
      <article key={f.id}>
        <div>
          <p className="content">
            id: {f.id} title: {f.title} content: {f.content.substring(0, 100)}
          </p>
          <button
            onClick={() => {
              dispatch(
                deleteFilter({
                  id: f.id,
                })
              );
            }}
          >
            X
          </button>
        </div>
      </article>
    );
  });

  return (
    <section>
      <h2>Posts</h2>
      {renderedFilters}
    </section>
  );
};

export default Results;
