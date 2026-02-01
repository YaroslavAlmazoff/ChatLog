import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CourseStructure from "../../course/CourseStructure";
import { list1, list2, list3 } from "../links-data";

const HomePageNavigation = () => {
  const auth = useContext(AuthContext);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://chatlog.ru/courses/android.json")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json) => {
        setCourse(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="homelinks">
      {auth.onCourse ? (
        !loading ? (
          <>
            <CourseStructure
              course={course}
              mode="view"
              activeLessonId={activeLessonId}
              onSelectLesson={setActiveLessonId}
            />
          </>
        ) : (
          <></>
        )
      ) : (
        <>
          {window.innerWidth > 500 ? (
            <>
              {list1(auth.userId).map((el) => (
                <NavLink
                  key={Date.now() + Math.random() * 100}
                  className="homelink"
                  to={el.link}
                >
                  {el.name}
                </NavLink>
              ))}
              {list2().map((el) => (
                <NavLink
                  key={Date.now() + Math.random() * 100}
                  className="homelink"
                  to={el.link}
                >
                  {el.name}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              {list3(auth.userId).map((el) => (
                <NavLink
                  key={Date.now() + Math.random() * 100}
                  className="homelink"
                  to={el.link}
                >
                  {el.name}
                </NavLink>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HomePageNavigation;
