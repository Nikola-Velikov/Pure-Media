// import { Button } from "react-bootstrap";
 import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <>
    <header className="tech-header header">
      <div className="container-fluid">
        <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand" href="#">
            <img src="images/version/tech-logo.png" alt="" />
          </a>
          <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
  <li className="nav-item">
    <Link className="nav-link" to="/" style={{ fontSize: '16px' }}>
    Прозрачна медия - автоматизирана система за оценка на сензационост в новините
    </Link>
  </li>
  <div className="nav-links-center">
    <li className="nav-item">
      <Link className="nav-link" to="/" style={{ fontSize: '16px' }}>
        Начало
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/news" style={{ fontSize: '16px' }}>
        Новини
      </Link>
    </li>
  </div>
</ul>


</div>

        </nav>
      </div>
    </header>
  </>
  
  );
}
