import { useState, useEffect, useContext } from "react";
import CourseStructure from "./CourseStructure";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import TestEditor from "./TestEditor";
import VideoEditor from "./VideoEditor";
import api from "../auth/api/auth";
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
  const [videoUploads, setVideoUploads] = useState({});

  /* ---------------- load ---------------- */

  useEffect(() => {
    const getCourse = async () => {
      const response = await api.get("/courses/android.json");
      setCourse(response.data);
      setLoading(false);
    };
    getCourse();
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

    if (item.type !== "video" && item.type !== "test") {
      setForm({
        number: item.data?.number ?? "",
        title: item.data?.title ?? "",
      });
    }
  };

  const handleVideoUpload = (videoId, file) => {
    setVideoUploads((prev) => ({
      ...prev,
      [videoId]: {
        file,
        status: "ready",
        progress: 0,
      },
    }));

    setIsDirty(true);
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

  const getTargetLabel = () => {
    if (mode === MODES.ADD_PART) return "курс";

    if (!selectedItem) return "не выбрано";

    const { partIndex, blockIndex, lessonIndex } = selectedItem.path || {};

    if (selectedItem.type === "part")
      return `часть: ${course.parts[partIndex].title}`;

    if (selectedItem.type === "block")
      return `блок: ${course.parts[partIndex].blocks[blockIndex].title}`;

    if (selectedItem.type === "lesson")
      return `урок: ${
        course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].title
      }`;

    if (selectedItem.type === "video") return "видео урока";

    if (selectedItem.type === "test") return "тест урока";

    return "не выбрано";
  };

  /* ---------------- apply ---------------- */

  const deleteItem = (item) => {
    console.log(item);
    if (!item) return;

    setCourse((prev) => {
      const copy = structuredClone(prev);
      const { partIndex, blockIndex, lessonIndex } = item.path || {};

      if (item.type === "video") {
        const videoId =
          course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video
            ?.id;

        setVideoUploads((prev) => {
          const next = { ...prev };
          delete next[videoId];
          return next;
        });
      }

      switch (item.type) {
        case "part":
          copy.parts.splice(partIndex, 1);
          break;

        case "block":
          copy.parts[partIndex].blocks.splice(blockIndex, 1);
          break;

        case "lesson":
          copy.parts[partIndex].blocks[blockIndex].lessons.splice(
            lessonIndex,
            1,
          );
          break;

        case "video":
          copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video =
            null;
          break;

        case "test":
          copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].test =
            null;
          break;

        default:
          return prev;
      }

      return copy;
    });

    setSelectedItem(null);
    setMode(null);
    setIsDirty(true);
  };

  const applyChange = () => {
    if (!isValidTarget()) return;

    if (mode === MODES.EDIT && selectedItem.type === "test") {
      setMode(null);
      return;
    }

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
        const videoId = crypto.randomUUID();

        copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video = {
          id: videoId,
          type: "video",
          number: Number(form.number),
          title: form.title,
          src: `${videoId}.mp4`,
        };

        setSelectedItem({
          type: "video",
          path: { partIndex, blockIndex, lessonIndex },
        });
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

  const uploadVideosSequentially = async () => {
    for (const [id, v] of Object.entries(videoUploads)) {
      if (v.status === "done") continue;

      const formData = new FormData();
      formData.append("videos", v.file, `${id}.mp4`);

      setVideoUploads((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: "uploading", progress: 0 },
      }));

      await api.post("/api/courses/upload-video", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);

          setVideoUploads((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              progress: percent,
            },
          }));
        },
      });

      setVideoUploads((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: "done", progress: 100 },
      }));
    }
  };

  const getSelectedVideo = () => {
    if (!selectedItem || selectedItem.type !== "video") return null;

    const { partIndex, blockIndex, lessonIndex } = selectedItem.path;
    return course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex]
      .video;
  };

  const saveData = async () => {
    try {
      // 1. сначала видео
      await uploadVideosSequentially();

      // 2. потом структура
      await api.post("/api/courses/edit", course);

      setIsDirty(false);
      alert("Данные и видео успешно сохранены");
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении");
    }
  };
  /* ---------------- test getter ---------------- */

  const getSelectedTest = () => {
    if (!selectedItem || selectedItem.type !== "test") return null;

    const { partIndex, blockIndex, lessonIndex } = selectedItem.path;
    return course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].test;
  };

  const collectVideoIdsFromCourse = () => {
    if (!course) return [];

    const ids = [];

    course.parts.forEach((part) => {
      part.blocks.forEach((block) => {
        block.lessons.forEach((lesson) => {
          if (lesson.video?.id) {
            ids.push(lesson.video.id);
          }
        });
      });
    });

    return ids;
  };

  const hasUploadingVideos = Object.values(videoUploads).some(
    (v) => v.status === "uploading",
  );

  const hasMissingVideos =
    course &&
    collectVideoIdsFromCourse().some((id) => {
      const upload = videoUploads[id];
      return !upload || upload.status !== "done";
    });

  const disableSave =
    !course || !isDirty || hasUploadingVideos || hasMissingVideos;

  /* ---------------- render ---------------- */

  if (loading) return <Loader />;
  if (userId !== "628e5aab0153706a3e18fe79") return null;

  return (
    <div className="course-editor">
      <span className="course-editor-title">Редактор курса</span>

      <div className="editor-actions">
        <button
          className="course-editor-add-button"
          onClick={() => startAdd(MODES.ADD_PART)}
        >
          + Часть
        </button>
        <button
          className="course-editor-add-button"
          onClick={() => startAdd(MODES.ADD_BLOCK)}
        >
          + Блок
        </button>
        <button
          className="course-editor-add-button"
          onClick={() => startAdd(MODES.ADD_LESSON)}
        >
          + Урок
        </button>
        <button
          className="course-editor-add-button"
          onClick={() => startAdd(MODES.ADD_VIDEO)}
        >
          + Видео
        </button>
        <button
          className="course-editor-add-button"
          onClick={() => startAdd(MODES.ADD_TEST)}
        >
          + Тест
        </button>

        <button
          className="course-editor-save-button"
          disabled={disableSave}
          onClick={saveData}
          title={
            hasUploadingVideos
              ? "Видео загружаются"
              : hasMissingVideos
                ? "Не все видео загружены"
                : ""
          }
        >
          💾 Сохранить
        </button>
      </div>

      {mode && selectedItem?.type !== "test" && (
        <div className="course-editor-form">
          <input
            className="input"
            type="number"
            placeholder="Номер"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <input
            className="input"
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div style={{ marginTop: 8 }}>
            <strong>Куда:</strong> {getTargetLabel()}
          </div>
          <button className="course-editor-ok" onClick={applyChange}>
            OK
          </button>
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
          onClose={() => {
            setSelectedItem(null);
            setMode(null);
          }}
        />
      )}

      {selectedItem?.type === "video" && (
        <VideoEditor
          video={getSelectedVideo()}
          upload={videoUploads[getSelectedVideo()?.id]}
          onChange={(updatedVideo) => {
            setCourse((prev) => {
              const copy = structuredClone(prev);
              const { partIndex, blockIndex, lessonIndex } = selectedItem.path;

              copy.parts[partIndex].blocks[blockIndex].lessons[
                lessonIndex
              ].video = updatedVideo;

              return copy;
            });

            setIsDirty(true);
          }}
          onUpload={handleVideoUpload}
        />
      )}

      {Object.entries(videoUploads).map(([id, v]) => (
        <div key={id} className="video-upload-row">
          <div>{id}</div>
          <progress value={v.progress} max="100" />
          <span>{v.status}</span>
        </div>
      ))}
      {hasMissingVideos && (
        <div className="editor-warning">⚠️ Не все видео загружены</div>
      )}

      {hasUploadingVideos && (
        <div className="editor-warning">⏳ Идёт загрузка видео</div>
      )}
      <CourseStructure
        course={course}
        mode="editor"
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        onEditItem={startEdit}
        onDeleteItem={deleteItem}
      />
    </div>
  );
};

export default CourseEditor;
