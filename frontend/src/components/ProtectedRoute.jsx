import { useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"

function ProtectedRoute({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const authenticated = isAuthenticated()

  useEffect(() => {
    const handlePageShow = () => {
      if (!isAuthenticated()) {
        navigate("/login", { replace: true })
      }
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [navigate])

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
