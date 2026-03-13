import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import hmbLogo from "../src/assets/hmbLogo.png";
import Sidebar from "./components/Sidebar";
import { useAuthStore } from "./stores/authStore";
import Employee from "./components/employee";
import Equipment from "./components/equipment";
import Attachment from "./components/attachment";
import ModuleGrid from "./components/moduleGrid";
import Job from "./components/job";
import User from "./components/user";
import { useState } from "react";
import { api } from "./hooks/apiConfig";
import { IoChevronBack } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useIsMutating } from "@tanstack/react-query";
import PopUpModal from "./components/PopUpModal";
import useUserMe from "./hooks/useUser";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const { activeModule, refreshToken, logout, user: userAuth } = useAuthStore();
  const { isLoading: loadingUser } = useUserMe();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error,
      );
    } finally {
      logout();
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };
  const isMutating = useIsMutating();
  const isSaving = isMutating > 0;

  if (loadingUser) {
    return <Spinner />;
  }

  // console.log("a", userAuth);

  return (
    <>
      <Container fluid className="d-flex flex-column min-vh-100 p-0">
        <Row className="p-3 m-0 align-items-center bg-white border-bottom">
          <Col className="d-flex justify-content-start">
            <Button
              variant="outline-secondary"
              size="sm"
              style={{
                borderRadius: "10px",
                fontWeight: "bold",
                width: "120px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                window.location.href = `https://ckarlosdev.github.io/HMBrandt/`;
              }}
            >
              <IoChevronBack size={18} />
              <span style={{ marginLeft: "4px" }}>Back</span>
            </Button>
          </Col>
          <Col xs="auto" className="text-center">
            <img style={{ width: "200px" }} src={hmbLogo} alt="Logo" />
          </Col>
          <Col className="d-flex justify-content-end align-items-center gap-3">
            <div
              style={{
                fontSize: "0.85rem",
                color: "#6c757d",
                borderRight: "1px solid #dee2e6",
                paddingRight: "15px",
                fontWeight: "500",
              }}
            >
              <span style={{ opacity: 0.7 }}>User: </span>
              <span className="text-dark">
                {userAuth?.fullName || "Guest"}
              </span>
            </div>

            <Button
              variant="outline-danger" // Cambié a danger para que sea claro que es Logout
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              style={{
                borderRadius: "10px",
                fontWeight: "bold",
                width: "120px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoading ? "Loging out..." : "Logout"}
              <MdLogout size={18} className="ms-2" />
            </Button>
          </Col>
        </Row>

        <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
          <Sidebar />
          <main className="flex-grow-1 p-4 bg-light overflow-auto">
            {activeModule === "Home" && <ModuleGrid />}
            {activeModule === "Employees" && <Employee />}
            {activeModule === "Equipments" && <Equipment />}
            {activeModule === "Attachments" && <Attachment />}
            {activeModule === "Jobs" && <Job />}
            {activeModule === "Users" && <User />}
          </main>
        </div>
      </Container>
      <PopUpModal />
      {isSaving && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          />
          <h4 className="mt-3">Saving Data...</h4>
        </div>
      )}
    </>
  );
}

export default App;
