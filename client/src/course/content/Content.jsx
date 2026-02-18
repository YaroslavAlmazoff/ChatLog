import useCourse from "../hooks/useHintTime";
import "../styles/content.css";
import CourseProgressBar from "./CourseProgressBar";
import TestRunner from "./TestRunner";
import VideoRunner from "./VideoRunner";
import { useRef, useEffect } from "react";

const Content = ({ lesson, progress, setProgress, course }) => {
  const { parseTimeCode } = useCourse();
  const videoContainerRef = useRef(null);
  const testContainerRef = useRef(null);
  const videoRef = useRef(null);

  const calculateTotalProgress = () => {
    if (!course || !progress) return 0;

    let totalPoints = 0;
    let earnedPoints = 0;

    course.parts.forEach((part) => {
      part.blocks.forEach((block) => {
        block.lessons.forEach((lesson) => {
          // 🎬 Видео
          if (lesson.video) {
            const totalBlocks = Math.ceil(lesson.video.duration / 10);
            totalPoints += totalBlocks;

            const watchedRaw =
              progress.videos?.[lesson.video.id]?.watchedBlocks || 0;

            const watched = Math.min(watchedRaw, totalBlocks);

            earnedPoints += watched;
          }

          // 🧪 Тест
          if (lesson.test) {
            const totalQuestions = lesson.test.questions.length;
            totalPoints += totalQuestions;

            const correct =
              progress.tests?.[lesson.test.id]?.correctQuestions || 0;

            earnedPoints += correct;
          }
        });
      });
    });

    if (!totalPoints) return 0;

    return Math.round((earnedPoints / totalPoints) * 100);
  };
  const totalProgress = calculateTotalProgress();

  useEffect(() => {
    if (!lesson.lesson.title) return;

    requestAnimationFrame(() => {
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
    });
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
          onProgress={(data) => {
            setProgress((prev) => {
              const old =
                prev.videos?.[lesson.lesson.video.id]?.watchedBlocks || 0;

              if (data.watchedBlocks <= old) return prev;

              return {
                ...prev,
                videos: {
                  ...prev.videos,
                  [lesson.lesson.video.id]: {
                    watchedBlocks: data.watchedBlocks,
                    totalBlocks: data.totalBlocks,
                  },
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
                  [lesson.lesson.test.id]: {
                    answers: testState.answers,
                    results: testState.results,
                    correctQuestions: testState.correctQuestions.length,
                    totalQuestions: testState.totalQuestions,
                    completed: testState.completed,
                  },
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
