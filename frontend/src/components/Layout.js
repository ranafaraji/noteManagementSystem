import { Outlet } from "react-router-dom"


//children of layout component, all com in here
const Layout = () => {
    return (
        <main className="App">
            <Outlet />
        </main>
    )
}

export default Layout;