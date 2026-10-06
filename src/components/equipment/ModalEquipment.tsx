import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { useEquipments, useSaveEquipment } from "../../hooks/useEquipments";
import { TbCheck, TbForklift, TbX } from "react-icons/tb";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";

type Props = {};

const PREFIXES: Record<string, string> = {
  Equipment: "E",
  "Heavy Trucks": "HT",
  "Light Trucks": "LT",
  "Semi Trailer": "ST",
  Trailer: "T",
};

const getNumericValue = (val = "") => val.replace(/\D/g, "");

function ModalEquipment({}: Props) {
  const { showModal, setShowModal, equipment, setEquipmentData } =
    useEquipmentStore();

  const { data: equipmentData } = useEquipments();
  const { mutate, isPending: isLoading } = useSaveEquipment();

  const {
    setShowModal: setPopUp,
    setTypeData,
    setModalText,
    user: userAuth,
  } = useAuthStore();

  // Estado para manejo de errores inline
  const [errors, setErrors] = useState<Record<string, string>>({});

  const equipNumberDuplicated = () => {
    const targetNumber = "E" + equipment.number.toString().replace(/\D/g, "");
    return equipmentData?.some(
      (equip) =>
        equip.number === targetNumber &&
        equip.equipmentsId !== equipment.equipmentsId,
    );
  };

  const dataValidation = () => {
    const newErrors: Record<string, string> = {};

    if (!equipment.name?.trim()) newErrors.name = "Equipment name is required";
    if (!equipment.family) newErrors.family = "Equipment type is required";
    if (!equipment.number) {
      newErrors.number = "Equipment number is required";
    } else if (equipNumberDuplicated()) {
      newErrors.number = "Equipment number already exists";
    }
    if (!equipment.manufacturing?.trim())
      newErrors.manufacturing = "Manufacturing is required";
    if (!equipment.status) newErrors.status = "Status is required";
    if (!equipment.condition) newErrors.condition = "Condition is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!dataValidation()) return;

    // const onlyDigits = equipment.number.toString().replace(/\D/g, "");
    const payload = {
      ...equipment,
      number: equipment.number.trim().toUpperCase(),
      user: userAuth?.email || "unknown",
    };

    mutate(
      { equipmentData: payload },
      {
        onSuccess: () => {
          setShowModal(false);
          setErrors({});
          setTypeData("Success");
          setModalText("Equipment data saved successfully.");
          setPopUp(true);
        },
        onError: (error) => {
          console.error(error);
          setTypeData("Error");
          setModalText("There was an error saving the data.");
          setPopUp(true);
        },
      },
    );
  };

  const inputStyle = {
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    padding: "0.6rem 0.75rem",
    fontSize: "0.925rem",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#64748B",
    marginBottom: "0.35rem",
    display: "block",
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
      contentClassName="border-0 shadow-lg"
      style={{ borderRadius: "16px" }}
    >
      {/* Header Minimalista */}
      <div className="d-flex align-items-center justify-content-between p-4 pb-0">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <TbForklift size={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold" style={{ color: "#0F172A" }}>
              New Equipment
            </h5>
            <small style={{ color: "#64748B", fontSize: "0.825rem" }}>
              Enter the equipment specs and assignment info
            </small>
          </div>
        </div>
        <Button
          variant="light"
          onClick={() => setShowModal(false)}
          className="rounded-circle p-2 border-0 d-flex align-items-center justify-content-center"
          style={{ width: "36px", height: "36px", color: "#64748B" }}
        >
          <TbX size={20} />
        </Button>
      </div>

      <Modal.Body className="p-4">
        <Form>
          {/* SECCIÓN 1: Identificación */}
          <div className="mb-4">
            <span
              className="fw-bold d-block mb-3"
              style={{
                fontSize: "0.8rem",
                color: "#2563EB",
                letterSpacing: "0.03em",
              }}
            >
              1. GENERAL INFORMATION
            </span>

            <Row className="g-3 mb-3">
              {/* Campo Name */}
              <Col>
                <label style={labelStyle}>Equipment Name *</label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Caterpillar Forklift"
                  value={equipment.name || ""}
                  isInvalid={!!errors.name}
                  onChange={(e) => {
                    setEquipmentData("name", e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  style={inputStyle}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <label style={labelStyle}>Odometer (hr / miles)</label>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  value={equipment.hour || ""}
                  onChange={(e) => setEquipmentData("hour", e.target.value)}
                  style={inputStyle}
                />
              </Col>
            </Row>

            <Row className="g-3">
              {/* Campo: Type (mapeado a 'family') */}
              <Col md={6}>
                <label style={labelStyle}>Equipment Type *</label>
                <Form.Select
                  value={equipment.family || ""}
                  isInvalid={!!errors.family}
                  onChange={(e) => {
                    const selectedFamily = e.target.value;
                    setEquipmentData("family", selectedFamily);
                    if (errors.family) setErrors({ ...errors, family: "" });

                    // Opcional: Mantener solo los números si ya se había escrito algo en 'number'
                    if (equipment.number) {
                      const digits = getNumericValue(equipment.number);
                      const newPrefix = PREFIXES[selectedFamily] || "";
                      setEquipmentData(
                        "number",
                        digits ? `${newPrefix}${digits}` : "",
                      );
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="">Select Type</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Heavy Truck">Heavy Truck</option>
                  <option value="Light Truck">Light Truck</option>
                  <option value="Semi Trailer">Semi Trailer</option>
                  <option value="Trailer">Trailer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.family}
                </Form.Control.Feedback>
              </Col>

              {/* Campo Equipment Number con prefijo fijo */}
              <Col md={6}>
                <label style={labelStyle}>Equipment Number *</label>
                <InputGroup hasValidation>
                  {/* Muestra el prefijo como un 'addon' bloqueado */}
                  <InputGroup.Text
                    style={{ backgroundColor: "#e9ecef", fontWeight: "600" }}
                  >
                    {PREFIXES[equipment.family] || "--"}
                  </InputGroup.Text>

                  <Form.Control
                    type="text"
                    placeholder="e.g. 33, 01"
                    disabled={!equipment.family} // Deshabilitado hasta seleccionar un Type
                    value={getNumericValue(equipment.number)} // Solo muestra los números en el input
                    isInvalid={!!errors.number}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, ""); // Solo permite dígitos
                      const currentPrefix = PREFIXES[equipment.family] || "";

                      // Guarda el valor completo (Ej: "HT33") en el estado
                      setEquipmentData(
                        "number",
                        digitsOnly ? `${currentPrefix}${digitsOnly}` : "",
                      );

                      if (errors.number) setErrors({ ...errors, number: "" });
                    }}
                    style={inputStyle}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.number}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
          </div>

          {/* SECCIÓN 2: Fabricación & Modelo */}
          <div className="mb-4">
            <span
              className="fw-bold d-block mb-3"
              style={{
                fontSize: "0.8rem",
                color: "#2563EB",
                letterSpacing: "0.03em",
              }}
            >
              2. TECHNICAL SPECS
            </span>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <label style={labelStyle}>Manufacturing *</label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Toyota"
                  value={equipment.manufacturing || ""}
                  isInvalid={!!errors.manufacturing}
                  onChange={(e) => {
                    setEquipmentData("manufacturing", e.target.value);
                    if (errors.manufacturing)
                      setErrors({ ...errors, manufacturing: "" });
                  }}
                  style={inputStyle}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.manufacturing}
                </Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <label style={labelStyle}>Model</label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 8FGU25"
                  value={equipment.model || ""}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setEquipmentData("model", upperAlphanumeric);
                  }}
                  style={inputStyle}
                />
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <label style={labelStyle}>Year</label>
                <Form.Select
                  value={equipment.year || ""}
                  onChange={(e) => setEquipmentData("year", e.target.value)}
                  style={inputStyle}
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
              </Col>

              <Col md={6}>
                <label style={labelStyle}>Serial Number</label>
                <Form.Control
                  type="text"
                  placeholder="SN-98765432"
                  value={equipment.serialNumber || ""}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setEquipmentData("serialNumber", upperAlphanumeric);
                  }}
                  style={inputStyle}
                />
              </Col>
            </Row>
          </div>

          {/* SECCIÓN 3: Estado & Uso */}
          <div>
            <span
              className="fw-bold d-block mb-3"
              style={{
                fontSize: "0.8rem",
                color: "#2563EB",
                letterSpacing: "0.03em",
              }}
            >
              3. STATUS & LOGISTICS
            </span>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <label style={labelStyle}>Status *</label>
                <Form.Select
                  value={equipment.status || ""}
                  isInvalid={!!errors.status}
                  onChange={(e) => {
                    setEquipmentData("status", e.target.value);
                    if (errors.status) setErrors({ ...errors, status: "" });
                  }}
                  style={inputStyle}
                >
                  <option value="">Select Status</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status}
                </Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <label style={labelStyle}>Condition *</label>
                <Form.Select
                  value={equipment.condition || ""}
                  isInvalid={!!errors.condition}
                  onChange={(e) => {
                    setEquipmentData("condition", e.target.value);
                    if (errors.condition)
                      setErrors({ ...errors, condition: "" });
                  }}
                  style={inputStyle}
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.condition}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <label style={labelStyle}>Purchase Date</label>
                <Form.Control
                  type="date"
                  value={equipment.purchaseDate || ""}
                  onChange={(e) =>
                    setEquipmentData("purchaseDate", e.target.value)
                  }
                  style={inputStyle}
                />
              </Col>

              <Col md={6}>
                <label style={labelStyle}>Equipment Status</label>

                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "0.55rem 0.75rem",
                    backgroundColor: "#F8FAFC",
                    minHeight: "42px",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          equipment.equipmentStatus === "1"
                            ? "#22C55E"
                            : "#94A3B8",
                      }}
                    />

                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color:
                          equipment.equipmentStatus === "1"
                            ? "#166534"
                            : "#64748B",
                      }}
                    >
                      {equipment.equipmentStatus === "1"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <Form.Check
                    type="switch"
                    checked={equipment.equipmentStatus === "1"}
                    onChange={(e) =>
                      setEquipmentData(
                        "equipmentStatus",
                        e.target.checked ? "1" : "0",
                      )
                    }
                    style={{
                      transform: "scale(1.05)",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>

      {/* Footer Minimalista */}
      <div className="d-flex align-items-center justify-content-end gap-2 p-4 pt-2 border-top-0">
        <Button
          variant="light"
          onClick={() => setShowModal(false)}
          className="fw-semibold px-4"
          style={{
            borderRadius: "8px",
            color: "#64748B",
            backgroundColor: "#F1F5F9",
            border: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="fw-semibold px-4 d-flex align-items-center gap-2"
          style={{
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            borderColor: "#2563EB",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
          }}
        >
          <TbCheck size={18} />
          {isLoading ? "Saving..." : "Save Equipment"}
        </Button>
      </div>
    </Modal>
  );
}

export default ModalEquipment;
