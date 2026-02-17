import useCourse from "../hooks/useHintTime";
import "../styles/content.css";
import CourseProgressBar from "./CourseProgressBar";
import TestRunner from "./TestRunner";
import VideoRunner from "./VideoRunner";
import { useRef, useEffect, useLayoutEffect } from "react";

const Content = ({ lesson, progress, setProgress, course }) => {
  const { parseTimeCode } = useCourse();
  const videoContainerRef = useRef(null);
  const testContainerRef = useRef(null);
  const videoRef = useRef(null);

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

  useLayoutEffect(() => {
    if (!lesson) return;

    if (lesson.type === "video" && videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    if (lesson.type === "test" && testContainerRef.current) {
      testContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [lesson]);

  if (!course || !progress || !progress.videos || !progress.tests) {
    return null;
  }
  if (!lesson) {
    return (
      <div className="course-content">
        <CourseProgressBar value={totalProgress} />
        <p>Выберите урок в структуре курса</p>
      </div>
    );
  }

  return (
    <div className="course-content">
      <CourseProgressBar value={totalProgress} />

      <h1>
        Урок {lesson.lesson.number}: {lesson.lesson.title}
      </h1>

      <div ref={videoContainerRef} key={lesson.lesson.video?.id}>
        <VideoRunner
          video={lesson.lesson.video}
          ref={videoRef}
          savedPercent={progress.videos?.[lesson.lesson.video?.id] || 0}
          onProgress={(percent) => {
            setProgress((prev) => {
              const old = prev.videos?.[lesson.lesson.video.id] || 0;
              if (percent <= old) return prev;

              return {
                ...prev,
                videos: {
                  ...prev.videos,
                  [lesson.lesson.video.id]: percent,
                },
              };
            });
          }}
        />
      </div>

      <div ref={testContainerRef} key={lesson.lesson.test?.id}>
        <TestRunner
          test={lesson.lesson.test}
          savedTestProgress={progress.tests?.[lesson.lesson.test?.id]}
          onTestProgress={(testState) => {
            setProgress((prev) => {
              return {
                ...prev,
                tests: {
                  ...prev.tests,
                  [lesson.lesson.test.id]: testState,
                },
              };
            });
          }}
          onHint={(timeCode) => {
            const seconds = parseTimeCode(timeCode);
            videoRef.current?.seekTo(seconds);
          }}
        />
      </div>
    </div>
  );
};

export default Content;
