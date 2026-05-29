import { NavLink } from "react-router-dom";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsCollection } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

function Sidebar() {
    const linkClass = ({ isActive }) =>
        `text-amber-50 text-lg rounded-2xl border flex items-center gap-2 px-3 py-2 transition-colors hover:bg-stone-700 ${
            isActive ? "border-stone-500/40 shadow-xl" : "border-transparent"
        }`

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-stone-800 flex flex-col p-4">
            <div className="flex flex-col space-y-3">
                <NavLink to="/music" className={linkClass}>
                    <IoMusicalNotesOutline /> Music
                </NavLink>
                <NavLink to="/explore" className={linkClass}>
                    <TfiWorld /> Explore
                </NavLink>
                <NavLink to="/notification" className={linkClass}>
                    <IoIosNotificationsOutline className="text-2xl"/> Notification
                </NavLink>
                <NavLink to="/collection" className={linkClass}>
                    <BsCollection /> Collection
                </NavLink>
            </div>

            <div className="mt-auto">
                <NavLink to="/profile" className={linkClass}>
                    <FaUserCircle /> Profile
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar