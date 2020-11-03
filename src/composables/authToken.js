const ID_TOKEN_KEY = "apollo-token"
const ID_USER_ID = "user-id"

export const getToken = () => (
  window.localStorage.getItem(ID_TOKEN_KEY)
)

export const saveToken = token => (
  window.localStorage.setItem(ID_TOKEN_KEY, token)
)

export const destroyToken = () => (
  window.localStorage.removeItem(ID_TOKEN_KEY)
)

export const getUserID = () => (
  window.localStorage.getItem(ID_USER_ID)
)

export const saveUserID = id => (
  window.localStorage.setItem(ID_USER_ID, id)
)

export const destroyUserID = () => (
  window.localStorage.removeItem(ID_USER_ID)
)

export default {
  getToken,
  saveToken,
  destroyToken,
  getUserID,
  saveUserID,
  destroyUserID
}
