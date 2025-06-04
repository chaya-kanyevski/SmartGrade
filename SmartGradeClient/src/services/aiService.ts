// services/aiService.ts
import axios from 'axios';

const API_BASE = '/api/ai'; // ודאי שזה תואם לנתיב בשרת שלך

export const generateLessonPlan = async (
  userId: number,
  topic: string,
  grade: string,
  duration: number,
  components: string[]
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/lesson-plan`, {
    userId,
    topic,
    grade,
    duration,
    components,
  });
  return response.data;
};

export const generateQuestions = async (
  userId: number,
  topic: string,
  questionType: string,
  difficulty: string,
  numQuestions: number,
  textOrFileName: string
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/questions`, {
    userId,
    topic,
    questionType,
    difficulty,
    numQuestions,
    textOrFileName,
  });
  return response.data;
};

export const summarizeText = async (
  userId: number,
  textOrFileName: string,
  summaryLength: number,
  summaryStyle: string
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/summarize`, {
    userId,
    textOrFileName,
    summaryLength,
    summaryStyle,
  });
  return response.data;
};

export const analyzeText = async (
  userId: number,
  textOrFileName: string,
  analysisType: string
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/analyze`, {
    userId,
    textOrFileName,
    analysisType,
  });
  return response.data;
};
