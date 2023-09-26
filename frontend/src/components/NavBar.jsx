import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="dark" className="px-4" expand="lg">
      <Navbar.Brand as={Link} to="/" className="text-light">
        SOPES 1
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/" className="text-light">
            Inicio
          </Nav.Link>
          <Nav.Link as={Link} to="/realtime" className="text-light">
            Tiempo Real
          </Nav.Link>
          <Nav.Link as={Link} to="/history" className="text-light">
            Historial
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
