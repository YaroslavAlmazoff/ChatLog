import React from "react"
import {Route, Routes, Navigate} from 'react-router-dom'
import About from "./components/pages/About"
import Contacts from "./components/pages/Contacts"
import Main from "./components/pages/Main"

const useRoutes = () => {
    //Кастомный хук для маршрутизации
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route exact path="/" element={<Main />} />
            <Route exact path="/contacts" element={<Contacts />} />
            <Route exact path="/about" element={<About />} />
        </Routes>
    )
}
export default useRoutes