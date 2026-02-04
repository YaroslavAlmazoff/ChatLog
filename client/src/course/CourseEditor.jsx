import { useState, useEffect, useContext } from "react";
import CourseStructure from "./CourseStructure";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import TestEditor from "./TestEditor";
import VideoEditor from "./VideoEditor";
import api from "../auth/api/auth";
import "./styles/course-editor.css";
import BackupsManager from "./BackupsManager";

const MODES = {
  ADD_PART: "add-part",
  ADD_BLOCK: "add-block",
  ADD_LESSON: "add-lesson",
  ADD_VIDEO: "add-video",
  ADD_TEST: "add-test",
  EDIT: "edit",
};

const CourseEditor = () => {
  const { userId, token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isBackupsVisible, setIsBackupsVisible] = useState(false);

  const [form, setForm] = useState({ number: "", title: "" });
  const [videoUploads, setVideoUploads] = useState({});

  const [expanded, setExpanded] = useState({
    parts: new Set(),
    blocks: new Set(),
    lessons: new Set(),
  });

  const partKey = (p) => `p-${p}`;
  const blockKey = (p, b) => `b-${p}-${b}`;
  const lessonKey = (p, b, l) => `l-${p}-${b}-${l}`;

  const expandParentsByPath = ({ partIndex, blockIndex, lessonIndex }) => {
    setExpanded((prev) => {
      const next = {
        parts: new Set(prev.parts),
        blocks: new Set(prev.blocks),
        lessons: new Set(prev.lessons),
      };

      if (partIndex !== undefined) next.parts.add(partKey(partIndex));
      if (blockIndex !== undefined)
        next.blocks.add(blockKey(partIndex, blockIndex));
      if (lessonIndex !== undefined)
        next.lessons.add(lessonKey(partIndex, blockIndex, lessonIndex));

      return next;
    });
  };

  const normalizeCourse = (raw) => {
    if (!raw || typeof raw !== "object") {
      return { parts: [] };
    }

    return {
      ...raw,
      parts: Array.isArray(raw.parts)
        ? raw.parts.map((part) => ({
            ...part,
            blocks: Array.isArray(part.blocks)
              ? part.blocks.map((block) => ({
                  ...block,
                  lessons: Array.isArray(block.lessons) ? block.lessons : [],
                }))
              : [],
          }))
        : [],
    };
  };

  useEffect(() => {
    const getCourse = async () => {
      const response = await api.get("/courses/android.json");
      setCourse(normalizeCourse(response.data));
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
    if (newMode === MODES.ADD_VIDEO && selectedItem?.type === "lesson") {
      const { partIndex, blockIndex, lessonIndex } = selectedItem.path;
      const videoId = crypto.randomUUID();

      setCourse((prev) => {
        const copy = structuredClone(prev);

        copy.parts[partIndex].blocks[blockIndex].lessons[lessonIndex].video = {
          id: videoId,
          type: "video",
          number: 1,
          title: "",
          src: null,
        };

        return copy;
      });

      setSelectedItem({
        type: "video",
        path: { partIndex, blockIndex, lessonIndex },
      });

      setIsDirty(true);
      setMode(null); // форма не нужна
      return;
    }

    if (
      (newMode === MODES.ADD_BLOCK && selectedItem?.type !== "part") ||
      (newMode === MODES.ADD_LESSON && selectedItem?.type !== "block") ||
      ((newMode === MODES.ADD_VIDEO || newMode === MODES.ADD_TEST) &&
        selectedItem?.type !== "lesson")
    ) {
      alert("Сначала выберите родительский элемент");
      return;
    }

    setMode(newMode);
    resetForm();
  };

  const startEdit = (item) => {
    // Тесты и видео — не через форму
    if (item.type === "test") {
      setSelectedItem(item);
      setMode(null); // форма не нужна
      return;
    }

    if (item.type === "video") {
      setSelectedItem(item);
      setMode(null);
      return;
    }

    const { partIndex, blockIndex, lessonIndex } = item.path;

    let target;

    if (item.type === "part") target = course.parts[partIndex];
    if (item.type === "block")
      target = course.parts[partIndex].blocks[blockIndex];
    if (item.type === "lesson")
      target = course.parts[partIndex].blocks[blockIndex].lessons[lessonIndex];

    if (!target) return;

    setSelectedItem(item);
    setMode(MODES.EDIT);
    setForm({
      number: target.number ?? "",
      title: target.title ?? "",
    });
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
    if (!item) return;

    const { type, path } = item;
    const { partIndex, blockIndex, lessonIndex } = path || {};

    setCourse((prev) => {
      const copy = structuredClone(prev);

      switch (type) {
        case "video": {
          const lesson =
            copy.parts?.[partIndex]?.blocks?.[blockIndex]?.lessons?.[
              lessonIndex
            ];

          if (!lesson || !lesson.video) return copy;

          const videoId = lesson.video.id;

          // удаляем видео из состояния загрузок
          if (videoId) {
            setVideoUploads((prevUploads) => {
              const next = { ...prevUploads };
              delete next[videoId];
              return next;
            });
          }

          lesson.video = null;
          break;
        }

        case "test": {
          const lesson =
            copy.parts?.[partIndex]?.blocks?.[blockIndex]?.lessons?.[
              lessonIndex
            ];

          if (lesson) {
            lesson.test = null;
          }
          break;
        }

        case "lesson": {
          copy.parts?.[partIndex]?.blocks?.[blockIndex]?.lessons?.splice(
            lessonIndex,
            1,
          );
          break;
        }

        case "block": {
          copy.parts?.[partIndex]?.blocks?.splice(blockIndex, 1);
          break;
        }

        case "part": {
          copy.parts?.splice(partIndex, 1);
          break;
        }

        default:
          return copy;
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
        const blocks = copy.parts[partIndex].blocks;

        blocks.push({
          number: Number(form.number),
          title: form.title,
          lessons: [],
        });

        const newBlockIndex = blocks.length - 1;

        setExpanded((prev) => {
          const next = {
            parts: new Set(prev.parts),
            blocks: new Set(prev.blocks),
            lessons: new Set(prev.lessons),
          };

          next.parts.add(partKey(partIndex));
          next.blocks.add(blockKey(partIndex, newBlockIndex));

          return next;
        });
      }

      if (mode === MODES.ADD_LESSON) {
        const lessons = copy.parts[partIndex].blocks[blockIndex].lessons;

        lessons.push({
          number: Number(form.number),
          title: form.title,
          video: null,
          test: null,
        });

        const newLessonIndex = lessons.length - 1;

        setExpanded((prev) => {
          const next = {
            parts: new Set(prev.parts),
            blocks: new Set(prev.blocks),
            lessons: new Set(prev.lessons),
          };

          next.parts.add(partKey(partIndex));
          next.blocks.add(blockKey(partIndex, blockIndex));

          return next;
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

      if (mode === MODES.ADD_VIDEO || mode === MODES.ADD_TEST) {
        expandParentsByPath({
          partIndex,
          blockIndex,
          lessonIndex,
        });
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

      await api.post("/api/courses/upload-videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
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
      if (!isCourseValid) {
        alert("Структура курса повреждена. Сохранение невозможно.");
        return;
      }
      await uploadVideosSequentially();
      const r = await api.post("/api/courses/edit", course, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(r);
      setVideoUploads({});
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

  const hasUploadingVideos = Object.values(videoUploads).some(
    (v) => v.status === "uploading",
  );

  const hasMissingVideos = Boolean(
    course?.parts?.some((part) =>
      part.blocks?.some((block) =>
        block.lessons?.some((lesson) => {
          const video = lesson.video;
          if (!video) return false;
          if (video.src) return false;
          return !videoUploads[video.id];
        }),
      ),
    ),
  );
  const isCourseValid = course && Array.isArray(course.parts);

  const disableSave =
    !isCourseValid ||
    !course ||
    !isDirty ||
    hasUploadingVideos ||
    hasMissingVideos;

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

      {mode &&
        (mode === MODES.ADD_PART || selectedItem) &&
        !["video", "test"].includes(selectedItem?.type) &&
        mode !== MODES.ADD_VIDEO && (
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
          <progress value={v.progress} max="100" />
          <span>&nbsp;{v.status}</span>
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
        expanded={expanded}
        setExpanded={setExpanded}
        partKey={partKey}
        blockKey={blockKey}
      />
      <br />
      <br />
      <br />
      <span
        className="course-editor-show-backups"
        onClick={() => setIsBackupsVisible((prev) => !prev)}
      >
        Автобэкапы
      </span>
      {isBackupsVisible && <BackupsManager />}
    </div>
  );
};

export default CourseEditor;
