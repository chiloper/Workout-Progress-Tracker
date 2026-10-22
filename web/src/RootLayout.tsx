import { NavLink, Outlet } from "react-router-dom";
import { Nav } from "./componentes/nav";
export default function RootLayout() {
  return (
    <>
      <main className="flex flex-col w-full relative ">
        <div className=" flex-1">
          <Outlet />
        </div>
        <Nav />
      </main>
    </>
  )
}