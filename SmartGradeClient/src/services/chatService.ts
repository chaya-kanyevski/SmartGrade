import axios from "axios";

const API_BASE = `${import.meta.env.VITE_REACT_APP_BASE_API_URL!}/Chat`;

export const getAllTopics = async () => {
  const res = await axios.get(`${API_BASE}/topics`);
  return res.data;
};

export const createTopic = async (title: string) => {
  const res = await axios.post(`${API_BASE}/topics`, { title });
  return res.data;
};

export const getMessagesByTopic = async (topicId: string) => {
  const res = await axios.get(`${API_BASE}/messages`, {
    params: { topicId },
  });
  return res.data;
};
