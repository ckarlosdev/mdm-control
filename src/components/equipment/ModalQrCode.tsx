import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import QRCodeView from "./QRCode";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { ImQrcode } from "react-icons/im";

type Props = {};

function ModalQrCode({}: Props) {
  const { setShowModalQr, showModalQr, equipment } = useEquipmentStore();

  return (
    <>
      <Modal
        show={showModalQr}
        onHide={() => setShowModalQr(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="w-100 text-center"
            style={{ marginLeft: "32px", fontWeight: "bold" }}
          >
            <ImQrcode style={{ marginRight: "8px" }} />
            Equipment QR
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Title className="w-100 text-center" style={{ fontWeight: "bold" }}>
            {equipment.number}
          </Modal.Title>
          <Row>
            <Col className="w-100 text-center" style={{ fontWeight: "bold" }}>
              <Form.Label htmlFor="inputPassword5">{equipment.name}</Form.Label>
            </Col>
          </Row>
          <QRCodeView />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModalQr(false)}
            style={{ fontWeight: "bold", width: "150px" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalQrCode;
