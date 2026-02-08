import { useState, useEffect, useContext } from "react";
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

  const saveProgress = async (newProgress) => {
    try {
      await api.post("/api/courses/progress/save", {
        userId,
        progress: newProgress,
      });
    } catch (e) {
      console.error("Ошибка сохранения прогресса", e);
    }
  };

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
            saveProgress={saveProgress}
          />
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
