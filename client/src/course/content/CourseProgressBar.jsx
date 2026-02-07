import "../styles/course-progress-bar.css";

const CourseProgressBar = ({ value }) => {
  return (
    <div className="course-progress">
      <div className="course-progress-header">
        <span>{value === 100 ? "🏆 Курс завершён" : "📊 Прогресс курса"}</span>
        <span className="course-progress-percent">{value}%</span>
      </div>

      <div className="course-progress-track">
        <div className="course-progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default CourseProgressBar;
