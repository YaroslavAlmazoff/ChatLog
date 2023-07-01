import api from "../auth/api/auth";

const useVerify = () => {
  const verify = async () => {
    try {
      const response = await api.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      });

      if (!response.data.verified) {
        window.location = "/login";
      }
    } catch (e) {
      console.log(e);
      window.location = "/login";
    }
  };
  return { verify };
};

export default useVerify;
