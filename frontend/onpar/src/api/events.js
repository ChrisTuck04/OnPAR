import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  }
}

//create Event
export const createEvents = async (eventData) => {
  const response = await axios.post(`${API_URL}/create-event`, eventData, getAuthHeaders())
  return response.data
}

//Read Events
export const readEvents = async (startDate, endDate) => {
  const response = await axios.post(`${API_URL}/read-event`, {startDate, endDate}, getAuthHeaders())
  return response.data
}

//Update Events
export const updateEvents = async (eventId, updateData) => {
  const response = await axios.post(`${API_URL}/update-event`, {eventId, ...updateData}, getAuthHeaders())
  return response.data
}

//Delete Events
export const deleteEvents = async (eventId) => {
  const response = await axios.post(`${API_URL}/delete-event`, {eventId}, getAuthHeaders())
  return response.data
}