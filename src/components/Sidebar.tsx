import { useState } from "react";
import { Button, Nav } from "react-bootstrap";
import "../styles/sidebar.css";
import { useAuthStore } from "../stores/authStore";

type Props = {};

function Sidebar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setActiveModule } = useAuthStore();

  return (
    <div
      className="bg-dark text-white p-3 shadow d-flex flex-column"
      style={{
        width: isCollapsed ? "80px" : "250px",
        minHeight: "88vh", // Esto asegura que llegue al fondo
        transition: "width 0.3s",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Botón para colapsar */}
      <Button
        variant="outline-light"
        className="mb-4 border-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? "☰" : "✕ Close"}
      </Button>

      {/* Título / Logo */}
      {!isCollapsed && <h4 className="px-3 mb-4 fw-bold">Master Data</h4>}

      {/* Navegación de los 5 Módulos */}
      <Nav className="flex-column flex-grow-1">
        <Nav.Link
          href="#moduleGrid"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Home")}
        >
          <span className="me-3">🏠</span> {!isCollapsed && "Home"}
        </Nav.Link>
        <Nav.Link
          href="#employees"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Employees")}
        >
          <span className="me-3">👷‍♂️</span> {!isCollapsed && "Employees"}
        </Nav.Link>
        <Nav.Link
          href="#equipments"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Equipments")}
        >
          <span className="me-3">🚜</span> {!isCollapsed && "Equipments"}
        </Nav.Link>
        <Nav.Link
          href="#attachments"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Attachments")}
        >
          <span className="me-3">⚙️</span> {!isCollapsed && "Attachments"}
        </Nav.Link>
        <Nav.Link
          href="#jobs"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Jobs")}
        >
          <span className="me-3">💼</span> {!isCollapsed && "Jobs"}
        </Nav.Link>
        <Nav.Link
          href="#users"
          className="text-white p-3 hover-effect rounded mb-2"
          onClick={() => setActiveModule("Users")}
        >
          <span className="me-3">👤</span> {!isCollapsed && "Users"}
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
