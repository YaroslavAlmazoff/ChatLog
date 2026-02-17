import { useState, useEffect, useContext, useRef } from "react";
import CourseStructure from "./CourseStructure";
import MiniProfile from "./MiniProfile";
import Content from "./content/Content";
import api from "../auth/api/auth";
import "./styles/course-page.css";
import { AuthContext } from "../context/AuthContext";

const CoursePage = () => {
  const { userId } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState({
    videos: {},
    tests: {},
  });

  const saveTimeout = useRef(null);

  useEffect(() => {
    const loadCourse = async () => {
      const res = await api.get("/courses/android.json");
      setCourse(res.data);
    };
    loadCourse();
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await api.get(`/api/courses/progress/${userId}.json`);

        setProgress({
          videos: res.data?.videos || {},
          tests: res.data?.tests || {},
        });
      } catch (e) {
        console.warn("Прогресс не найден, создаём пустой");
        setProgress({ videos: {}, tests: {} });
      }
    };

    if (userId) loadProgress();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await api.post("/api/courses/progress/save", {
          userId,
          progress,
        });
      } catch (e) {
        console.error("Ошибка сохранения прогресса", e);
      }
    }, 1000);
  }, [progress]);

  useEffect(() => {
    if (!userId) return;

    const handleSaveOnExit = () => {
      if (!progress) return;

      const data = JSON.stringify({
        userId,
        progress,
      });

      navigator.sendBeacon(
        process.env.REACT_APP_API_URL + "/api/courses/progress/save",
        new Blob([data], { type: "application/json" }),
      );
    };

    window.addEventListener("beforeunload", handleSaveOnExit);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleSaveOnExit();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleSaveOnExit);
    };
  }, [progress, userId]);

  useEffect(() => {
    if (!course) return;

    const saved = localStorage.getItem("lastLesson");
    if (!saved) return;

    let parsed;

    try {
      parsed = JSON.parse(saved);
    } catch {
      localStorage.removeItem("lastLesson");
      return;
    }

    const { partIndex, blockIndex, lessonIndex } = parsed;

    const lessonObject =
      course?.parts?.[partIndex]?.blocks?.[blockIndex]?.lessons?.[lessonIndex];

    if (lessonObject) {
      setActiveLesson(lessonObject);
    } else {
      localStorage.removeItem("lastLesson");
    }
  }, [course]);

  if (!course) return null;

  return (
    <div className="course-page">
      <div className="course-layout">
        <aside className="course-sidebar">
          <CourseStructure
            course={course}
            selectedItem={activeLesson}
            onSelectItem={setActiveLesson}
          />
        </aside>

        <main className="course-main">
          <MiniProfile />
          <Content
            lesson={activeLesson}
            course={course}
            progress={progress}
            setProgress={setProgress}
          />
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
