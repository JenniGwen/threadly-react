function Navbar({ page, onNavigate, onLogout }) {
    return (
        <nav className="navbar">
        <div className="navbar-content">
            <h1 className="logo">threadly</h1>

            <div className="nav-links">
            <button
                className={page === "home" ? "active" : ""}
                onClick={() => onNavigate("home")}
            >
                Home
            </button>
            <button
                className={page === "profile" ? "active" : ""}
                onClick={() => onNavigate("profile")}
            >
                Profile
            </button>
            <button onClick={onLogout}>Logout</button>
            </div>
        </div>
        </nav>
    );
}

export default Navbar;