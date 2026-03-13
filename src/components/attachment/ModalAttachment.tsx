import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useAttachmentStore from "../../stores/useAttachmentStore";
import { useAttachments, useSaveAttachment } from "../../hooks/useAttachments";
import { useMemo } from "react";
import { GiGears } from "react-icons/gi";
import { useAuthStore } from "../../stores/authStore";

type Props = {};

function ModalAttachment({}: Props) {
  const { attachment, showModal, setShowModal, setAttachmentData } =
    useAttachmentStore();

  const {
    setShowModal: setPopUp,
    setTypeData,
    setModalText,
    user: userAuth,
  } = useAuthStore();

  const { data: attachmentsData } = useAttachments();
  const { mutate } = useSaveAttachment();

  const familyList = useMemo(() => {
    return [
      ...new Set(
        (attachmentsData || []).map((item) => item.family).filter(Boolean),
      ),
    ];
  }, [attachmentsData]);

  const handleSave = () => {
    if (!dataValidation()) return;

    const onlyDigits = attachment.number.toString().replace(/\D/g, "");

    const payload = {
      ...attachment,
      number: "A" + onlyDigits,
      user: userAuth?.email || "unknown",
    };

    mutate(
      { attachmentData: payload },
      {
        onSuccess: () => {
          setShowModal(false);
          setTypeData("Success");
          setModalText("Attachment data saved successfully.");
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

  const dataValidation = () => {
    if (attachment.name === "") {
      alert("Attachment name missing.");
      return false;
    }
    if (attachment.number === "") {
      alert("Attachment number missing.");
      return false;
    }
    if (attachNumberDuplicated()) {
      alert("Attachment number already exist");
      return false;
    }
    if (attachment.family === "") {
      alert("Attachment family missing.");
      return false;
    }
    if (attachment.name === "") {
      alert("Attachment name missing.");
      return false;
    }

    return true;
  };

  const attachNumberDuplicated = () => {
    const targetNumber = "A" + attachment.number.toString().replace(/\D/g, "");

    return attachmentsData?.some(
      (attach) =>
        attach.number === targetNumber &&
        attach.attachmentsId !== attachment.attachmentsId,
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
            <GiGears style={{ marginRight: "8px" }} />
            Attachment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <FloatingLabel
                controlId="floatingAttachmentName"
                label="Attachment name"
              >
                <Form.Control
                  type="text"
                  placeholder="Attachment Name"
                  value={attachment.name}
                  onChange={(e) => setAttachmentData("name", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingAttachmentNumber"
                label="Attachment number"
              >
                <Form.Control
                  type="text"
                  placeholder="Attachment Number"
                  value={attachment.number.replace(/\D/g, "")}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setAttachmentData("number", onlyNums);
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
                controlId="floatingAttachmentFamily"
                label="Attachment family"
              >
                <Form.Control
                  type="text"
                  list="families-list"
                  placeholder="Attachment Family"
                  value={attachment.family}
                  onChange={(e) => {
                    setAttachmentData("family", e.target.value);
                  }}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
                <datalist id="families-list">
                  {familyList.map((family) => (
                    <option key={family} value={family} />
                  ))}
                </datalist>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingPurchaseDate"
                label="Purchase date"
              >
                <Form.Control
                  type="date"
                  placeholder="Purchase date"
                  value={attachment.purchaseDate}
                  onChange={(e) =>
                    setAttachmentData("purchaseDate", e.target.value)
                  }
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel
                controlId="floatingAttachmentManufacturing"
                label="Manufacturing"
              >
                <Form.Control
                  type="text"
                  placeholder="Manufacturing"
                  value={attachment.manufacturing}
                  onChange={(e) =>
                    setAttachmentData("manufacturing", e.target.value)
                  }
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingAttachmentModel" label="Model">
                <Form.Control
                  type="text"
                  placeholder="Model"
                  value={attachment.model}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setAttachmentData("model", upperAlphanumeric);
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
              <FloatingLabel controlId="floatingAttachmentYear" label="Year">
                <Form.Select
                  value={attachment.year}
                  onChange={(e) => setAttachmentData("year", e.target.value)}
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
                controlId="floatingAttachmentSerialNumber"
                label="Serial number"
              >
                <Form.Control
                  type="text"
                  placeholder="Serial Number"
                  value={attachment.serialNumber}
                  onChange={(e) => {
                    const upperAlphanumeric = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setAttachmentData("serialNumber", upperAlphanumeric);
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
                controlId="floatingAttachmentStatus"
                label="Status"
              >
                <Form.Select
                  aria-label="Status"
                  value={attachment.status}
                  onChange={(e) => {
                    setAttachmentData("status", e.target.value);
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
                controlId="floatingAttachmentCondition"
                label="Condition"
              >
                <Form.Select
                  aria-label="Condition"
                  value={attachment.conditions}
                  onChange={(e) => {
                    setAttachmentData("conditions", e.target.value);
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

export default ModalAttachment;
