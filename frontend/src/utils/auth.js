export function signOut() {
  localStorage.removeItem("token")
  localStorage.removeItem("userName")
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"))
}
