import { useState, useEffect, useContext } from "react";
import CourseStructure from "./CourseStructure";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import "./styles/course-editor.css";

const MODES = {
  ADD_PART: "add-part",
  ADD_BLOCK: "add-block",
  ADD_LESSON: "add-lesson",
  ADD_VIDEO: "add-video",
  ADD_TEST: "add-test",
  EDIT: "edit",
};

const CourseEditor = () => {
  const { userId } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  const [form, setForm] = useState({
    number: "",
    title: "",
  });

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

  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const saveData = async () => {
    try {
      const res = await fetch("https://chatlog.ru/api/courses/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!res.ok) throw new Error();
      setIsDirty(false);
      alert("Данные успешно сохранены");
    } catch {
      alert("Ошибка при сохранении");
    }
  };

  /* ---------------- actions ---------------- */

  const resetForm = () => {
    setForm({ number: "", title: "" });
    setSelectedItem(null);
  };

  const startAdd = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const startEdit = (item) => {
    setMode(MODES.EDIT);
    setSelectedItem(item);
    setForm({
      number: item.data?.number ?? "",
      title: item.data?.title ?? "",
    });
  };

  /* ---------------- helpers ---------------- */

  const isValidTarget = () => {
    if (mode === MODES.ADD_PART) return true;

    if (!selectedItem) return false;

    if (mode === MODES.ADD_BLOCK) return selectedItem.type === "part";
    if (mode === MODES.ADD_LESSON) return selectedItem.type === "block";
    if (mode === MODES.ADD_VIDEO || mode === MODES.ADD_TEST)
      return selectedItem.type === "lesson";

    if (mode === MODES.EDIT) return true;

    return false;
  };

  const getTargetLabel = () => {
    if (mode === MODES.ADD_PART) return "курс";

    if (!selectedItem) return "не выбрано";

    return `${selectedItem.type}: ${selectedItem.data?.title ?? ""}`;
  };

  /* ---------------- apply changes ---------------- */

  const applyChange = () => {
    if (!isValidTarget()) return;

    setCourse((prev) => {
      const copy = structuredClone(prev);

      const { partIndex, blockIndex, lessonIndex } = selectedItem?.path || {};

      if (mode === MODES.ADD_PART) {
        copy.parts.push({
          number: Number(form.number),
          title: form.title,
          blocks: [],
        });
      }

      if (mode === MODES.ADD_BLOCK) {
        copy.parts[partIndex].blocks.push({
          number: Number(form.number),
          title: form.title,
          lessons: [],
        });
      }

      if (mode === MODES.ADD_LESSON) {
        copy.parts[partIndex].blocks[blockIndex].lessons.push({
          number: Number(form.number),
          title: form.title,
          video: null,
          test: null,
        });
      }

      if (mode === MODES.ADD_VIDEO) {
        copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video = {
          type: "video",
          number: Number(form.number),
          title: form.title,
          src: "",
        };
      }

      if (mode === MODES.ADD_TEST) {
        copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].test = {
          type: "test",
          number: Number(form.number),
          title: form.title,
          questions: [],
        };
      }

      if (mode === MODES.EDIT) {
        let target;

        if (selectedItem.type === "part") target = copy.parts[partIndex];

        if (selectedItem.type === "block")
          target = copy.parts[partIndex].blocks[blockIndex];

        if (selectedItem.type === "lesson")
          target =
            copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex];

        if (selectedItem.type === "video")
          target =
            copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video;

        if (selectedItem.type === "test")
          target =
            copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].test;

        if (target) {
          target.number = Number(form.number);
          target.title = form.title;
        }
      }

      return copy;
    });
    setIsDirty(true);
    resetForm();
    setMode(null);
  };

  /* ---------------- render ---------------- */

  return (
    <>
      {userId === "628e5aab0153706a3e18fe79" ? (
        <div className="course-editor">
          <span className="course-editor-title">Редактор курса</span>
          {!loading ? (
            <>
              {/* ACTIONS */}
              <div className="editor-actions">
                <button
                  className="course-editor-add-button"
                  onClick={() => startAdd(MODES.ADD_PART)}
                >
                  + Добавить часть
                </button>
                <button
                  className="course-editor-add-button"
                  onClick={() => startAdd(MODES.ADD_BLOCK)}
                >
                  + Добавить блок
                </button>
                <button
                  className="course-editor-add-button"
                  onClick={() => startAdd(MODES.ADD_LESSON)}
                >
                  + Добавить урок
                </button>
                <button
                  className="course-editor-add-button"
                  onClick={() => startAdd(MODES.ADD_VIDEO)}
                >
                  + Добавить видео
                </button>
                <button
                  className="course-editor-add-button"
                  onClick={() => startAdd(MODES.ADD_TEST)}
                >
                  + Добавить тест
                </button>
                <button
                  className="course-editor-save-button"
                  onClick={saveData}
                  disabled={!isDirty}
                >
                  💾 Сохранить
                </button>
              </div>

              {/* FORM */}
              {mode && (
                <div className="course-editor-form">
                  <div className="course-editor-form-field">
                    <label>Номер</label>
                    <input
                      className="input"
                      type="number"
                      value={form.number}
                      onChange={(e) =>
                        setForm({ ...form, number: e.target.value })
                      }
                    />
                  </div>

                  <div className="course-editor-form-field">
                    <label>Название</label>
                    <input
                      className="input"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <strong>Куда:</strong> {getTargetLabel()}
                  </div>

                  <button
                    className="course-editor-ok"
                    disabled={!isValidTarget()}
                    onClick={applyChange}
                  >
                    OK
                  </button>
                </div>
              )}

              {/* STRUCTURE */}
              <CourseStructure
                course={course}
                mode="editor"
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                onEditItem={startEdit}
              />
            </>
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CourseEditor;
