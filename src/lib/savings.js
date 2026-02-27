import api from './axios'

export const getSavings = () =>
    api.get('/api/savings')

export const createSavingsGoal = (data) =>
    api.post('/api/savings', data)

export const deleteSavingsGoal = (id) =>
    api.delete(`/api/savings/${id}`)

export const addContribution = (goalId, data) =>
    api.post(`/api/savings/${goalId}/contributions`, data)

export const deleteContribution = (goalId, contributionId) =>
    api.delete(`/api/savings/${goalId}/contributions/${contributionId}`)