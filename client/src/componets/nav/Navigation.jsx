import {
  Route,Link
} from "react-router-dom";

export default function App() {
  return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/mine">My Collectibles</Link>
            </li>
          </ul>
        </nav>

      </div>
  );
}