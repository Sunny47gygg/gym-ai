import { Link } from "react-router-dom"
import { Dumbbell } from "lucide-react"

function Navbar() {
  return (
    <section className="bg-black border-b border-gray-600">
      <div className="max-w-7xl mx-auto py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ml-6">
            <Dumbbell className="text-3xl text-lime-400"/>
            <p className="font-semibold text-xl">RepCoach AI</p>
          </div>
          <div className="pr-18">
            <Link to="/login" className="mr-9 cursor-pointer text-white hover:text-lime-400">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="font-semibold cursor-pointer rounded-xl bg-lime-400 py-2 px-4 text-gray-900 hover:bg-lime-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Navbar