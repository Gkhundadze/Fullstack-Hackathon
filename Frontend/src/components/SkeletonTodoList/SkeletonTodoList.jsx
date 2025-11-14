import './SkeletonTodoList.css';
function SkeletonTodoList() {
  return (
    <ul className="skeleton-list">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="skeleton-item">
          <div className="skeleton-left">
            <div className="skeleton-checkbox skeleton"></div>
            <div className="skeleton-text skeleton"></div>
          </div>
          <div className="skeleton-buttons">
            <div className="skeleton-btn skeleton"></div>
            <div className="skeleton-btn skeleton"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SkeletonTodoList;
