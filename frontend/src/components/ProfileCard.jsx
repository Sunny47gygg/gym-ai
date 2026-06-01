import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react"
import { signOut } from "../utils/auth"

function ProfileCard({ subtitle }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName") || "User"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    navigate("/login", { replace: true })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_0_24px_rgba(132,255,36,0.08)] transition hover:border-lime-400/30 hover:bg-white/[0.06]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-gray-950">
          <User className="h-5 w-5" />
        </div>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-semibold text-white">{userName}</p>
          {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-[#0a0f14]/95 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-200 transition hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="h-4 w-4 text-zinc-400" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
