import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import useEmployeeStore from "../../stores/useEmployeeStore";
import { useEmployees, useSaveEmployee } from "../../hooks/useEmployees";
import { GrUserWorker } from "react-icons/gr";
import { useAuthStore } from "../../stores/authStore";

type Props = {};

function ModalEmployee({}: Props) {
  const { showModal, setShowModal, employee, setEmployeeData } =
    useEmployeeStore();
  const { data: employeesData } = useEmployees();
  const {
    setShowModal: setPopUp,
    setTypeData,
    setModalText,
    user: userAuth,
  } = useAuthStore();

  const { mutate } = useSaveEmployee();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEmployeeData("status", e.target.value);
  };

  const handleSave = () => {
    if (!validation()) return;

    const prefixNumber = employee.legalName === "HM Brandt LLC" ? "H" : "C";
    const onlyDigits = employee.employeeNumber.toString().replace(/\D/g, "");

    const payload = {
      ...employee,
      employeeNumber: prefixNumber + onlyDigits,
      user: userAuth?.email || "unknown",
    };

    mutate(
      { employeeData: payload },
      {
        onSuccess: () => {
          setShowModal(false);

          setTypeData("Success");
          setModalText("Employee data saved successfully.");
          setPopUp(true);
        },
        onError: (error) => {
          console.log(error);
          setTypeData("Error");
          setModalText("There was an error saving the data.");
          setPopUp(true);
        },
      },
    );
  };

  const validation = () => {
    if (employee.legalName === "") {
      alert("Company field missing.");
      return false;
    }
    if (employee.firstName === "") {
      alert("First name field missing.");
      return false;
    }
    if (employee.lastName === "") {
      alert("Last name field missing.");
      return false;
    }
    if (employee.title === "") {
      alert("Role field missing.");
      return false;
    }
    if (employee.employeeNumber === "") {
      alert("Employee number field missing.");
      return false;
    }
    if (empNumberDuplicated()) {
      alert("Employee number already exist.");
      return false;
    }
    return true;
  };

  const empNumberDuplicated = () => {
    const prefix = employee.legalName === "HM Brandt LLC" ? "H" : "C";
    const targetNumber =
      prefix + employee.employeeNumber.toString().replace(/\D/g, "");

    return employeesData?.some(
      (emp) =>
        emp.employeeNumber === targetNumber &&
        emp.employeesId !== employee.employeesId,
    );
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="w-100 text-center"
            style={{ marginLeft: "32px", fontWeight: "bold" }}
          >
            <GrUserWorker style={{ marginRight: "8px" }} />
            Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingFirstName" label="Company">
                <Form.Select
                  aria-label="Select company"
                  value={employee.legalName}
                  onChange={(e) => {
                    setEmployeeData("legalName", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="HM Brandt LLC">HM Brandt LLC</option>
                  <option value="Creative Disposal & Recycling LLC">
                    Creative Disposal & Recycling LLC
                  </option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingFirstName" label="First Name">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={employee.firstName}
                  onChange={(e) => setEmployeeData("firstName", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingLastName" label="Last Name">
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  value={employee.lastName}
                  onChange={(e) => setEmployeeData("lastName", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingFirstName" label="Role">
                <Form.Select
                  aria-label="Select company"
                  value={employee.title}
                  onChange={(e) => {
                    setEmployeeData("title", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="Labor">Labor</option>
                  <option value="Driver">Driver</option>
                  <option value="Office">Office</option>
                  <option value="Shop">Shop</option>
                  <option value="Supervisor">Supervisor</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingNumber" label="Employee number">
                <Form.Control
                  type="number"
                  placeholder="Employee number"
                  value={employee.employeeNumber.replace(/\D/g, "")}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setEmployeeData("employeeNumber", onlyNums);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title style={{ textAlign: "center" }}>
                    Status
                  </Card.Title>
                  <Row className="justify-content-center">
                    <Col xs="auto">
                      <Form.Check
                        label="Active"
                        name="statusGroup"
                        type="radio"
                        id="radio-active"
                        value={"Active"}
                        checked={employee.status === "Active"}
                        onChange={handleChange}
                        style={{ fontWeight: "bold" }}
                      />
                    </Col>
                    <Col xs="auto">
                      <Form.Check
                        label="Terminated"
                        name="statusGroup"
                        type="radio"
                        id="radio-terminated"
                        value={"Terminated"}
                        checked={employee.status === "Terminated"}
                        onChange={handleChange}
                        style={{ fontWeight: "bold" }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            style={{ fontWeight: "bold", width: "150px" }}
          >
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => {
              handleSave();
            }}
            style={{ fontWeight: "bold", width: "150px" }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEmployee;
