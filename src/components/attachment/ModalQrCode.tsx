import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import QRCodeView from "./QRCode";
import { ImQrcode } from "react-icons/im";
import useAttachmentStore from "../../stores/useAttachmentStore";

type Props = {};

function ModalQrCode({}: Props) {
  const { setShowModalQr, showModalQr, attachment } = useAttachmentStore();

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
            Attachment QR
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Title className="w-100 text-center" style={{ fontWeight: "bold" }}>
            {attachment.number}
          </Modal.Title>
          <Row>
            <Col className="w-100 text-center" style={{ fontWeight: "bold" }}>
              <Form.Label htmlFor="inputPassword5">{attachment.name}</Form.Label>
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
