// services/aiService.ts
import api from './api'

const API_BASE = import.meta.env.VITE_REACT_APP_BASE_API_URL!;
const LESSON_PLAN_API = `${API_BASE}/ai/lesson-plan`;
const GENERATE_QUESTIONS_API = `${API_BASE}/ai/generate-questions`;
const SUMMARIZE_TEXT_API = `${API_BASE}/ai/summarize`;
const ANALYZE_TEXT_API = `${API_BASE}/ai/analyze`;
const TEACHING_TIPS_API = `${API_BASE}/ai/teaching-tips`;

export const generateLessonPlan = async (
  userId: number,
  topic: string,
  grade: string,
  duration: number,
  components: string[]
): Promise<string> => {
  const response = await api.post(LESSON_PLAN_API, {
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
  const response = await api.post(GENERATE_QUESTIONS_API, {
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
  summaryLength: string,
  summaryStyle: string
): Promise<string> => {
  const response = await api.post(SUMMARIZE_TEXT_API, {
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
  const response = await api.post(ANALYZE_TEXT_API, {
    userId,
    textOrFileName,
    analysisType,
  });
  return response.data;
};

export const getTeachingTips = async (userId: number): Promise<string[]> => {
  const response = await api.post(TEACHING_TIPS_API, { userId });
  return response.data;
};