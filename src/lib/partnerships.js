import api from './axios'

export const getMyPartnership = () =>
    api.get('/api/partnerships')

export const sendInvite = (invite_code) =>
    api.post('/api/partnerships/invite', { invite_code })

export const acceptInvite = () =>
    api.post('/api/partnerships/accept')

export const leavePartnership = () =>
    api.delete('/api/partnerships/leave')

export const getPendingInvites = () =>
    api.get('/api/partnerships/pending')