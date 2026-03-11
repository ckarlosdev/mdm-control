import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { GiClockwiseRotation } from "react-icons/gi";
import useUserStore from "../../stores/useUserStore";
import { FaUserPlus } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { generatePassword } from "../../utils/utils";
import { useRegisterUser } from "../../hooks/useUsers";
import { useAuthStore } from "../../stores/authStore";

type Props = {};

function ModalUserCreation({}: Props) {
  const [emailError, setEmailError] = useState("");
  const { setShowModal: setPopUp, setTypeData, setModalText } = useAuthStore();

  const {
    userCreation,
    showModalCreate,
    setShowModalCreate,
    setUserDataCreation,
  } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate } = useRegisterUser();

  const handleSave = () => {
    if (!dataValidation()) return;
    mutate(userCreation, {
      onSuccess: () => {
        setShowModalCreate(false);

        setTypeData("Success");
        setModalText("User data created successfully.");
        setPopUp(true);
      },
      onError: (error) => {
        console.log(error);
        setTypeData("Error");
        setModalText("There was an error saving the data.");
        setPopUp(true);
      },
    });
  };

  const dataValidation = () => {
    if (userCreation.firstName === "") {
      alert("First name is required.");
      return false;
    }
    if (userCreation.lastName === "") {
      alert("Last name is required.");
      return false;
    }
    if (userCreation.email === "") {
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

  const handleGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    const newPass = generatePassword({
      length: 8,
      includeSymbols: false,
    });
    setUserDataCreation("password", newPass);
  };

  return (
    <Modal
      show={showModalCreate}
      onHide={() => setShowModalCreate(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="w-100 text-center"
          style={{ marginLeft: "32px", fontWeight: "bold" }}
        >
          <FaUserPlus style={{ marginRight: "8px" }} />
          User registration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
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
                    value={userCreation.firstName}
                    onChange={(e) =>
                      setUserDataCreation("firstName", e.target.value)
                    }
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
                    value={userCreation.lastName}
                    onChange={(e) =>
                      setUserDataCreation("lastName", e.target.value)
                    }
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
                    value={userCreation.email}
                    isInvalid={!!emailError}
                    onChange={(e) => {
                      const error = validateEmail(e.target.value);
                      setEmailError(error);
                      setUserDataCreation("email", e.target.value);
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
                <div className="position-relative d-flex flex-column justify-content-center">
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={userCreation.password}
                      readOnly
                      style={{
                        paddingRight: "110px",
                        zIndex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    />
                  </FloatingLabel>
                  <div
                    className="position-absolute d-flex align-items-center gap-2"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10, // <--- Esto lo pone por encima de todo
                      height: "100%", // Para asegurar que el centrado vertical sea real
                      pointerEvents: "none", // Evita que el contenedor bloquee el click al input...
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 border-0 bg-transparent text-secondary"
                      style={{ pointerEvents: "auto" }}
                    >
                      {showPassword ? (
                        <IoEyeOff size={19} />
                      ) : (
                        <IoEye size={19} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1 shadow-sm"
                      style={{
                        pointerEvents: "auto",
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      <GiClockwiseRotation
                        className="hover:rotate-180 transition-transform"
                        size={16}
                      />
                      <span>AUTO</span>
                    </button>
                  </div>
                </div>
                {/* <small
                  className="text-muted d-block mt-1"
                  style={{ fontSize: "11px" }}
                >
                  Usa al menos 12 caracteres con símbolos.
                </small> */}
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
                        checked={userCreation.roles?.includes("ROLE_USER")}
                        onChange={(e) =>
                          setUserDataCreation("roles", [e.target.value])
                        }
                        style={{ fontWeight: "bold" }}
                      />
                      <Form.Check
                        inline
                        label="Supervisor"
                        name="roleGroup"
                        type={"radio"}
                        id={`supervisor`}
                        value="ROLE_SUPERVISOR"
                        checked={userCreation.roles?.includes(
                          "ROLE_SUPERVISOR",
                        )}
                        onChange={(e) =>
                          setUserDataCreation("roles", [e.target.value])
                        }
                        style={{ fontWeight: "bold" }}
                      />
                      <Form.Check
                        inline
                        // disabled
                        label="Admin"
                        name="roleGroup"
                        type={"radio"}
                        value="ROLE_ADMIN"
                        checked={userCreation.roles?.includes("ROLE_ADMIN")}
                        onChange={(e) =>
                          setUserDataCreation("roles", [e.target.value])
                        }
                        id={`admin`}
                        style={{ fontWeight: "bold" }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={() => setShowModalCreate(false)}
          style={{ fontWeight: "bold", width: "150px" }}
        >
          Close
        </Button>
        <Button
          variant="outline-primary"
          style={{ fontWeight: "bold", width: "150px" }}
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUserCreation;
