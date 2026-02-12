import "../styles/content.css";
import CourseProgressBar from "./CourseProgressBar";
import TestRunner from "./TestRunner";
import VideoRunner from "./VideoRunner";
import { useRef, useEffect } from "react";

const Content = ({ lesson, progress, setProgress, course, saveProgress }) => {
  const videoRef = useRef(null);
  const testRef = useRef(null);

  const calculateTotalProgress = () => {
    if (!course || !progress) return 0;

    let total = 0;
    let completed = 0;

    course.parts.forEach((part) => {
      part.blocks.forEach((block) => {
        block.lessons.forEach((lesson) => {
          if (lesson.video) {
            total++;
            const vp = progress.videos?.[lesson.video.id] || 0;
            if (vp >= 90) completed++;
          }

          if (lesson.test) {
            total++;
            if (progress.tests?.[lesson.test.id]?.completed) {
              completed++;
            }
          }
        });
      });
    });

    return total ? Math.round((completed / total) * 100) : 0;
  };
  const totalProgress = calculateTotalProgress();

  useEffect(() => {
    if (!lesson) return;

    // ждём рендера
    setTimeout(() => {
      if (lesson.path.kind === "video" && videoRef.current) {
        videoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      if (lesson.path.kind === "test" && testRef.current) {
        testRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  }, [lesson]);

  if (!course || !progress || !progress.videos || !progress.tests) {
    return null;
  }
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

      <div ref={videoRef}>
        <VideoRunner
          key={lesson.lesson.video?.id}
          video={lesson.lesson.video}
          savedPercent={progress.videos?.[lesson.lesson.video?.id] || 0}
          onProgress={(percent) => {
            setProgress((prev) => {
              const old = prev.videos?.[lesson.lesson.video.id] || 0;
              if (percent <= old) return prev;

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
      </div>

      <div ref={testRef}>
        <TestRunner
          key={lesson.lesson.test?.id}
          test={lesson.lesson.test}
          savedTestProgress={progress.tests?.[lesson.lesson.test?.id]}
          onTestProgress={(testState) => {
            setProgress((prev) => {
              const updated = {
                ...prev,
                tests: {
                  ...prev.tests,
                  [lesson.lesson.test.id]: testState,
                },
              };

              saveProgress(updated);
              return updated;
            });
          }}
        />
      </div>
    </div>
  );
};

export default Content;
