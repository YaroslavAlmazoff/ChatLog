import "../styles/content.css";
import TestRunner from "./TestRunner";

const Content = ({ lesson }) => {
  if (!lesson) {
    return (
      <div className="content">
        <h2>Выберите урок</h2>
        <p>Выберите урок в структуре курса слева 👈</p>
      </div>
    );
  }

  return (
    <div className="content">
      <h1>
        Урок {lesson.lesson.number}: {lesson.lesson.title}
      </h1>

      {/* ВИДЕО */}
      {lesson.lesson.video && lesson.lesson.video.src && (
        <div className="lesson-video">
          <video
            controls
            width="100%"
            src={
              process.env.REACT_APP_API_URL +
              "/courses/videos/" +
              lesson.lesson.video.src
            }
          />
        </div>
      )}

      {/* ТЕСТ */}
      {lesson.lesson.test && (
        <div className="lesson-test">
          <h2>🧪 Тест</h2>
          <p>{lesson.lesson.test.title}</p>
          {lesson.lesson.test && <TestRunner test={lesson.lesson.test} />}
        </div>
      )}
    </div>
  );
};

export default Content;
