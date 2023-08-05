import { Link } from "react-router-dom"

const LinkPage = () => {
    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/">Home</Link>
            <br />
        </section>
    )
}

export default LinkPage;