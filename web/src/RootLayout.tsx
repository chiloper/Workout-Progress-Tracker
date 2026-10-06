import { NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <nav>
      this is home
      <NavLink to={'/'} >home</NavLink>
      <NavLink to={'/history'} >history</NavLink>
      <NavLink to={'/log'}>log</NavLink>
      <NavLink to={'/progress'}>progress</NavLink>
      <NavLink to={'/login'}>login</NavLink>
    </nav>
  )
}