import { useState, useEffect } from "react";
import CourseStructure from "./CourseStructure";
import MiniProfile from "./MiniProfile";
import Content from "./content/Content";
import api from "../auth/api/auth";
import "./style/course-page.css";

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      const res = await api.get("/courses/android.json");
      setCourse(res.data);
    };
    loadCourse();
  }, []);

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
          <Content lesson={activeLesson} />
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
