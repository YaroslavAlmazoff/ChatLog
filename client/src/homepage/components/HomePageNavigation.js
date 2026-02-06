import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import CourseStructure from "../../course/CourseStructure";
import { list1, list2, list3 } from "../links-data";
import Loader from "../../common_components/Loader";
import api from "../../auth/api/auth";

const HomePageNavigation = ({ activeLesson, onSelectLesson }) => {
  const auth = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourse = async () => {
      const response = await api.get("/courses/android.json");
      setCourse(response.data);
      setLoading(false);
    };
    getCourse();
  }, []);

  return (
    <div className="homelinks">
      {auth.onCourse ? (
        !loading ? (
          <>
            <CourseStructure
              course={course}
              selectedItem={activeLesson}
              onSelectItem={onSelectLesson}
            />
          </>
        ) : (
          <Loader />
        )
      ) : (
        <>
          {window.innerWidth > 500 ? (
            <>
              {list1(auth.userId).map((el) => (
                <NavLink key={el.name} className="homelink" to={el.link}>
                  {el.name}
                </NavLink>
              ))}
              {list2().map((el) => (
                <NavLink key={el.name} className="homelink" to={el.link}>
                  {el.name}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              {list3(auth.userId).map((el) => (
                <NavLink key={el.name} className="homelink" to={el.link}>
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
