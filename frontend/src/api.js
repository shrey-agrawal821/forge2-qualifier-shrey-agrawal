import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;

// Boards
export const getBoards = () => api.get('/boards');
export const getBoard = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards', data);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

// Lists
export const createList = (boardId, data) => api.post(`/boards/${boardId}/lists`, data);
export const updateList = (id, data) => api.put(`/lists/${id}`, data);
export const deleteList = (id) => api.delete(`/lists/${id}`);

// Cards
export const createCard = (listId, data) => api.post(`/lists/${listId}/cards`, data);
export const updateCard = (id, data) => api.put(`/cards/${id}`, data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);

// Tags
export const getTags = () => api.get('/tags');
export const createTag = (data) => api.post('/tags', data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);
export const attachTag = (cardId, tagId) => api.post(`/cards/${cardId}/tags`, { tag_id: tagId });
export const detachTag = (cardId, tagId) => api.delete(`/cards/${cardId}/tags/${tagId}`);

// Members
export const getMembers = () => api.get('/members');
export const assignMember = (cardId, memberId) => api.post(`/cards/${cardId}/members`, { member_id: memberId });
export const removeMember = (cardId, memberId) => api.delete(`/cards/${cardId}/members/${memberId}`);
