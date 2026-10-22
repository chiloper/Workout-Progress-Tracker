import { Calendar, DumbbellIcon, LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import { LiaHomeSolid } from "react-icons/lia";
import { NavLink } from "react-router-dom";

const pageType = {
  home: "home",
  exercises: "exercises",
  progress: "progress",
  history: "history",
}


type PageType = (typeof pageType)[keyof typeof pageType]

const items = [
  { type: "home", name: "หน้าหลัก", to: "/", icon: <LiaHomeSolid size={22} /> },
  { type: "exercises", name: "จดเวท", to: "/exercises", icon: <DumbbellIcon size={22} /> },
  { type: "progress", name: "Progress", to: "/progress", icon: <LineChart size={22} /> },
  { type: "history", name: "ประวัติ", to: "/history", icon: <Calendar size={22} /> },
]

export function Nav() {

  const [isSelect, setIsSelect] = useState("/")

  const isActive = "flex flex-col place-items-center gap-1  text-muted "
  const notActive = "flex flex-col place-items-center gap-1 text-accent font-bold"

  useEffect(() => {
    const storage = localStorage.getItem("select")
    if (!storage) {
      setIsSelect("/")
      return
    }
    setIsSelect(storage)
  }, [])


  const handleSelect = (select: PageType) => {
    const storage = localStorage.getItem("select")
    if (storage === select) return

    setIsSelect(select)
    localStorage.setItem("select", select)
  }

  return (
    <>
      <div className="pb-[env(safe-area-inset-bottom)] sticky bottom-0 w-full bg-card h-16 grid grid-cols-4  place-items-center ">
        {items.map((m) => {
          return (
            <NavLink to={m.to} onClick={() => handleSelect(m.type)}>
              <div id={m.type} className={isSelect === m.type ? notActive : isActive}>
                {m.icon}
                <label className=" text-xs"> {m.name} </label>
              </div>
            </NavLink>
          )
        })}
      </div >
    </>
  )
}