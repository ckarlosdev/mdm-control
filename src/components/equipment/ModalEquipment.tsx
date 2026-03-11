import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { useEquipments, useSaveEquipment } from "../../hooks/useEquipments";
import { TbForklift } from "react-icons/tb";

type Props = {};

function ModalEquipment({}: Props) {
  const { showModal, setShowModal, equipment, setEquipmentData } =
    useEquipmentStore();

  const { data: equipmentData } = useEquipments();
  const { mutate } = useSaveEquipment();

  const handleSave = () => {
    console.log(equipment);
    if (!dataValidation()) return;

    const onlyDigits = equipment.number.toString().replace(/\D/g, "");

    const payload = {
      ...equipment,
      number: "E" + onlyDigits,
    };

    mutate({ equipmentData: payload });
  };

  const dataValidation = () => {
    if (equipment.name === "") {
      alert("Equipment name missing");
      return false;
    }
    if (equipment.number === "") {
      alert("Equipment number missing");
      return false;
    }
    if (equipNumberDuplicated()) {
      alert("Equipment number already exist");
      return false;
    }
    if (equipment.manufacturing === "") {
      alert("Equipment manufacturing missing");
      return false;
    }
    if (equipment.status === "") {
      alert("Equipment status missing");
      return false;
    }
    if (equipment.condition === "") {
      alert("Equipment condition missing");
      return false;
    }

    return true;
  };

  const equipNumberDuplicated = () => {
    const targetNumber = "E" + equipment.number.toString().replace(/\D/g, "");
    console.log(targetNumber);
    console.log(equipment.equipmentsId);

    return equipmentData?.some(
      (equip) =>
        equip.number === targetNumber &&
        equip.equipmentsId !== equipment.equipmentsId,
    );
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="w-100 text-center"
            style={{ marginLeft: "32px", fontWeight: "bold" }}
          >
            <TbForklift style={{ marginRight: "8px" }} />
            Equipment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <FloatingLabel
                controlId="floatingEquipmentName"
                label="Equipment name"
              >
                <Form.Control
                  type="text"
                  placeholder="Equipment Name"
                  value={equipment.name}
                  onChange={(e) => setEquipmentData("name", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingEquipmentNumber"
                label="Equipment number"
              >
                <Form.Control
                  type="text"
                  placeholder="Equipment Number"
                  value={equipment.number.replace(/\D/g, "")}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setEquipmentData("number", onlyNums);
                  }}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel
                controlId="floatingEquipmentManufacturing"
                label="Manufacturing"
              >
                <Form.Control
                  type="text"
                  placeholder="Manufacturing"
                  value={equipment.manufacturing}
                  onChange={(e) =>
                    setEquipmentData("manufacturing", e.target.value)
                  }
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingEquipmentModel" label="Model">
                <Form.Control
                  type="text"
                  placeholder="Model"
                  value={equipment.model}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setEquipmentData("model", upperAlphanumeric);
                  }}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingEquipmentYear" label="Year">
                <Form.Select
                  value={equipment.year}
                  onChange={(e) => setEquipmentData("year", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select Year</option>
                  {Array.from(
                    { length: 50 },
                    (_, i) => new Date().getFullYear() - i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingEquipmentSerialNumber"
                label="Serial number"
              >
                <Form.Control
                  type="text"
                  placeholder="Serial Number"
                  value={equipment.serialNumber}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setEquipmentData("serialNumber", upperAlphanumeric);
                  }}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingEquipmentStatus" label="Status">
                <Form.Select
                  aria-label="Status"
                  value={equipment.status}
                  onChange={(e) => {
                    setEquipmentData("status", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingEquipmentCondition"
                label="Condition"
              >
                <Form.Select
                  aria-label="Condition"
                  value={equipment.condition}
                  onChange={(e) => {
                    setEquipmentData("condition", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel
                controlId="floatingPurchaseDate"
                label="Purchase date"
              >
                <Form.Control
                  type="date"
                  placeholder="Purchase date"
                  value={equipment.purchaseDate}
                  onChange={(e) => setEquipmentData("purchaseDate", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingOdometer"
                label="Odometer (hr / miles)"
              >
                <Form.Control
                  type="number"
                  placeholder="Odometer"
                  value={equipment.hour}
                  onChange={(e) => {
                    setEquipmentData("hour", e.target.value);
                  }}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                />
              </FloatingLabel>
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
            style={{ fontWeight: "bold", width: "150px" }}
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEquipment;
