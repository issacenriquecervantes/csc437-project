import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";

//interface for the navigation link objects
interface NavLink {
    text: string;
    href: string;
}

interface IHeaderProps {
    handleDashboardReload: () => void;
}

//sets the default navigation links, these can edited for scalibility
const DEFAULT_NAV_LINKS: NavLink[] = [
    { text: "Dashboard", href: "/" }
];

export default function Header(props: IHeaderProps) {

    //gets the current location
    const { pathname } = useLocation();

    //initializes "isDark" to the result of the boolean checking whether there is a "theme" in local storage or if it's value is "dark"
    const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

    //creates booleans indicating whether the current page is an auth or dashboard
    const isAuthPage = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <header>
            <h1>
                <Link to="/">GrC Project Manager</Link>
            </h1>

            <div className="header-links">

            {(!isAuthPage) && (
                <nav aria-label="Main navigation">
                    <ul>
                        {DEFAULT_NAV_LINKS.map(({ text, href }) => (
                            <li key={href}>
                                <Link to={href} onClick={props.handleDashboardReload}>{text}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <label title="Toggle dark mode">
                Toggle Theme
                <input
                    id="theme-toggle-input"
                    type="checkbox"
                    checked={isDark}
                    onChange={() => setIsDark(prev => !prev)}
                    aria-label="Toggle dark mode"
                />
                {" "}
                <FontAwesomeIcon icon={faCircleHalfStroke} id="theme-icon" />
            </label>

            </div>
        </header>
    );
}
