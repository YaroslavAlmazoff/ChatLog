import { useEffect } from "react";
import Subscriber from "./components/Subscriber";
import api from "../../../auth/api/auth";
import "../../styles/subscribers.css";
import { useParams } from "react-router";

const Subscribers = ({ pub, subscribers, setSubscribers }) => {
  const params = useParams();

  useEffect(() => {
    const getSubscribers = async () => {
      const response = await api.get(
        `/api/public/firstsubscribers/${params.id}`
      );
      setSubscribers(response.data.subscribers);
    };
    getSubscribers();
  }, [pub, params]);

  return (
    <div className="public-subscribers block">
      {subscribers.length ? (
        subscribers.map((id) => <Subscriber id={id} />)
      ) : (
        <p style={{ color: "white" }}>Нет подписчиков</p>
      )}
    </div>
  );
};

export default Subscribers;
