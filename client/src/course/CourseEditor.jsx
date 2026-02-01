import { useState } from "react";
import courseJson from "./course.json";
import CourseStructure from "./CourseStructure";
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
  const [course, setCourse] = useState(courseJson);

  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState({
    number: "",
    title: "",
  });

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

    resetForm();
    setMode(null);
  };

  /* ---------------- render ---------------- */

  return (
    <div className="course-editor">
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
      </div>

      {/* FORM */}
      {mode && (
        <div className="editor-form">
          <div>
            <label>Номер</label>
            <input
              className="input"
              type="number"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </div>

          <div>
            <label>Название</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <strong>Куда:</strong> {getTargetLabel()}
          </div>

          <button disabled={!isValidTarget()} onClick={applyChange}>
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
    </div>
  );
};

export default CourseEditor;
