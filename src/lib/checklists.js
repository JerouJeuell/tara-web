import api from './axios'

export const getChecklists = () =>
    api.get('/api/checklists')

export const createChecklist = (data) =>
    api.post('/api/checklists', data)

export const deleteChecklist = (id) =>
    api.delete(`/api/checklists/${id}`)

export const addItem = (checklistId, title) =>
    api.post(`/api/checklists/${checklistId}/items`, { title })

export const toggleItem = (checklistId, itemId) =>
    api.patch(`/api/checklists/${checklistId}/items/${itemId}/toggle`)

export const deleteItem = (checklistId, itemId) =>
    api.delete(`/api/checklists/${checklistId}/items/${itemId}`)