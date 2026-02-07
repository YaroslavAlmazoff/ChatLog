import api from "../../auth/api/auth";

export const useCourseProgress = (userId) => {
  const updateProgress = async (patch) => {
    await api.post("/api/courses/progress/update", {
      userId,
      patch,
    });
  };

  return { updateProgress };
};
