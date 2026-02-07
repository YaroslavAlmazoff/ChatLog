import "../styles/content.css";
import CourseProgressBar from "./CourseProgressBar";
import TestRunner from "./TestRunner";
import VideoRunner from "./VideoRunner";

const Content = ({ lesson, progress, setProgress, course, saveProgress }) => {
  const calculateTotalProgress = () => {
    let total = 0;
    let completed = 0;

    course.parts.forEach((part) => {
      part.blocks.forEach((block) => {
        block.lessons.forEach((lesson) => {
          if (lesson.video) {
            total++;
            if (progress.videos[lesson.video.id] >= 90) {
              completed++;
            }
          }

          if (lesson.test) {
            total++;
            if (progress.tests[lesson.test.id]?.completed) {
              completed++;
            }
          }
        });
      });
    });

    if (!total) return 0;
    return Math.round((completed / total) * 100);
  };
  const totalProgress = calculateTotalProgress();

  if (!lesson) {
    return (
      <div className="content">
        <CourseProgressBar value={totalProgress} />
        <p>👈 Выберите урок слева</p>
      </div>
    );
  }

  return (
    <div className="content">
      <CourseProgressBar value={totalProgress} />

      <h1>
        Урок {lesson.lesson.number}: {lesson.lesson.title}
      </h1>

      <VideoRunner
        video={lesson.lesson.video}
        onProgress={(percent) => {
          setProgress((prev) => {
            const updated = {
              ...prev,
              videos: {
                ...prev.videos,
                [lesson.lesson.video.id]: percent,
              },
            };

            saveProgress(updated);
            return updated;
          });
        }}
      />

      <TestRunner
        test={lesson.lesson.test}
        onTestProgress={(testProgress) => {
          setProgress((prev) => {
            const updated = {
              ...prev,
              tests: {
                ...prev.tests,
                [lesson.lesson.test.id]: testProgress,
              },
            };

            saveProgress(updated);
            return updated;
          });
        }}
      />
    </div>
  );
};

export default Content;
