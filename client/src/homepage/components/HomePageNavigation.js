import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CourseStructure from "../../course/CourseStructure";
import { list1, list2, list3 } from "../links-data";

const HomePageNavigation = () => {
  const auth = useContext(AuthContext);
  const [activeLessonId, setActiveLessonId] = useState(null);

  return (
    <div className="homelinks">
      {auth.onCourse ? (
        <CourseStructure
          course={course}
          mode="view"
          activeLessonId={activeLessonId}
          onSelectLesson={setActiveLessonId}
        />
      ) : (
        <>
          {window.innerWidth > 500 ? (
            <>
              {list1.map((el) => (
                <NavLink
                  key={Date.now() + Math.random() * 100}
                  className="homelink"
                  to={el.link}
                >
                  {el.name}
                </NavLink>
              ))}
              {list2.map((el) => (
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
              {list3.map((el) => (
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
