import {
  Link,
  NavLink
} from "react-router-dom";

import "./navbar_style.css";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark">
      <Link className="navbar-brand" to="/">
        <div className="col-6">
          <h2>Crypto Art</h2>
          {/* <img className="logo1" src="https://avatars.githubusercontent.com/u/19630321?v=4" alt="Stopify" /> */}
        </div>
      </Link>
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#collapse_target"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="collapse_target">
        <div className="col-12">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/create">
                Create
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/explore">
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mine" className="nav-link">
                My Collectibles
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar

