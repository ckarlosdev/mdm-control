import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import useUserStore from "../../stores/useUserStore";
import { useUpdateUser } from "../../hooks/useUsers";
import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";

type Props = {};

function ModalUserUpdate({}: Props) {
  const { user, showModalUpdate, setShowModalUpdate, setUserData } =
    useUserStore();
  const { setShowModal: setPopUp, setTypeData, setModalText } = useAuthStore();

  const [emailError, setEmailError] = useState("");
  const { mutate } = useUpdateUser();

  const handleSave = () => {
    // console.log("saving", user);
    if (!dataValidation()) return;
    mutate(user, {
      onSuccess: () => {
        setShowModalUpdate(false);
        setTypeData("Success");
        setModalText("User data updated successfully.");
        setPopUp(true);
      },
      onError: (error) => {
        console.log(error);
        setTypeData("Error");
        setModalText("There was an error updating the data.");
        setPopUp(true);
      },
    });
  };

  const dataValidation = () => {
    if (user.firstName === "") {
      alert("First name is required.");
      return false;
    }
    if (user.lastName === "") {
      alert("Last name is required.");
      return false;
    }
    if (user.email === "") {
      alert("Email is required.");
      return false;
    }
    if (!!emailError) {
      alert("Email is invalid.");
      return false;
    }

    return true;
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "El email es requerido";
    if (!regex.test(email)) return "Formato de email inválido";
    return "";
  };

  return (
    <Modal
      show={showModalUpdate}
      onHide={() => setShowModalUpdate(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="w-100 text-center"
          style={{ marginLeft: "32px", fontWeight: "bold" }}
        >
          <FaUserEdit style={{ marginRight: "8px" }} />
          Updating User Data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <FloatingLabel
              controlId="floatingFirstName"
              label="First Name"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Austin"
                value={user.firstName}
                onChange={(e) => setUserData("firstName", e.target.value)}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "17px",
                }}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floatingLastName"
              label="Last Name"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Brandt"
                value={user.lastName}
                onChange={(e) => setUserData("lastName", e.target.value)}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "17px",
                }}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Email address">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={user.email}
                isInvalid={!!emailError}
                onChange={(e) => {
                  const error = validateEmail(e.target.value);
                  setEmailError(error);
                  setUserData("email", e.target.value);
                }}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "17px",
                }}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col>
            <Card>
              <Card.Body className="d-flex justify-content-center">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={user.isActive ? "Active" : "Inactive"}
                  checked={user.isActive}
                  style={{ fontWeight: "bold" }}
                  onChange={(e) => {
                    setUserData("isActive", e.target.checked);
                  }}
                  className={user.isActive ? "text-success" : "text-danger"}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mt-1">
              <Card.Body>
                <Card.Title
                  className="text-center"
                  style={{ fontWeight: "bold" }}
                >
                  Role
                </Card.Title>
                <div className="d-flex justify-content-center">
                  <Form.Check
                    inline
                    label="User"
                    name="roleGroup"
                    type={"radio"}
                    id={`user`}
                    value="ROLE_USER"
                    checked={user.roles?.includes("ROLE_USER")}
                    onChange={(e) => setUserData("roles", [e.target.value])}
                    style={{ fontWeight: "bold" }}
                  />
                  <Form.Check
                    inline
                    label="Supervisor"
                    name="roleGroup"
                    type={"radio"}
                    id={`supervisor`}
                    value="ROLE_SUPERVISOR"
                    checked={user.roles?.includes("ROLE_SUPERVISOR")}
                    onChange={(e) => setUserData("roles", [e.target.value])}
                    style={{ fontWeight: "bold" }}
                  />
                  <Form.Check
                    inline
                    // disabled
                    label="Admin"
                    name="roleGroup"
                    type={"radio"}
                    value="ROLE_ADMIN"
                    checked={user.roles?.includes("ROLE_ADMIN")}
                    onChange={(e) => setUserData("roles", [e.target.value])}
                    id={`admin`}
                    style={{ fontWeight: "bold" }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={() => setShowModalUpdate(false)}
          style={{ fontWeight: "bold", width: "150px" }}
        >
          Cancel
        </Button>
        <Button
          variant="outline-primary"
          style={{ fontWeight: "bold", width: "150px" }}
          onClick={() => {
            handleSave();
          }}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUserUpdate;
