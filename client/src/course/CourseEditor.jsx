import { useState, useEffect, useContext } from "react";
import CourseStructure from "./CourseStructure";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import TestEditor from "./TestEditor";
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
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [form, setForm] = useState({ number: "", title: "" });

  /* ---------------- load ---------------- */

  useEffect(() => {
    fetch("https://chatlog.ru/courses/android.json")
      .then((res) => res.json())
      .then(setCourse)
      .finally(() => setLoading(false));
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

  /* ---------------- helpers ---------------- */

  const resetForm = () => {
    setForm({ number: "", title: "" });
  };

  const startAdd = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const startEdit = (item) => {
    setMode(MODES.EDIT);
    setSelectedItem(item);

    if (item.type !== "video") {
      setForm({
        number: item.data?.number ?? "",
        title: item.data?.title ?? "",
      });
    }
  };

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

  /* ---------------- apply ---------------- */

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

        setSelectedItem({
          type: "test",
          path: { partIndex, blockIndex, lessonIndex },
        });
      }

      if (mode === MODES.EDIT && selectedItem) {
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

  /* ---------------- test getter ---------------- */

  const getSelectedTest = () => {
    if (!selectedItem || selectedItem.type !== "test") return null;

    const { partIndex, blockIndex, lessonIndex } = selectedItem.path;
    return course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].test;
  };

  /* ---------------- render ---------------- */

  if (loading) return <Loader />;
  if (userId !== "628e5aab0153706a3e18fe79") return null;

  return (
    <div className="course-editor">
      <span className="course-editor-title">Редактор курса</span>

      <div className="editor-actions">
        <button
          className="course-editor-save-button"
          onClick={() => startAdd(MODES.ADD_PART)}
        >
          + Часть
        </button>
        <button
          className="course-editor-save-button"
          onClick={() => startAdd(MODES.ADD_BLOCK)}
        >
          + Блок
        </button>
        <button
          className="course-editor-save-button"
          onClick={() => startAdd(MODES.ADD_LESSON)}
        >
          + Урок
        </button>
        <button
          className="course-editor-save-button"
          onClick={() => startAdd(MODES.ADD_VIDEO)}
        >
          + Видео
        </button>
        <button
          className="course-editor-save-button"
          onClick={() => startAdd(MODES.ADD_TEST)}
        >
          + Тест
        </button>

        <button
          className="course-editor-save-button"
          disabled={!isDirty}
          onClick={() => alert("TODO: save")}
        >
          💾 Сохранить
        </button>
      </div>

      {mode && (
        <div className="course-editor-form">
          <input
            type="number"
            placeholder="Номер"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <input
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <button onClick={applyChange}>OK</button>
        </div>
      )}

      {selectedItem?.type === "test" && (
        <TestEditor
          test={getSelectedTest()}
          onChange={(updatedTest) => {
            setCourse((prev) => {
              const copy = structuredClone(prev);
              const { partIndex, blockIndex, lessonIndex } = selectedItem.path;

              copy.parts[partIndex].blocks[blockIndex].lessons[
                lessonIndex
              ].test = updatedTest;

              return copy;
            });
            setIsDirty(true);
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <CourseStructure
        course={course}
        mode="editor"
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        onEditItem={startEdit}
      />
    </div>
  );
};

export default CourseEditor;
