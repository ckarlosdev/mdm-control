import { Button, Modal } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";
import { GoCheckCircleFill } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

type Props = {};

function PopUpModal({}: Props) {
  const { showModal, setShowModal, typeData, modalText } = useAuthStore();
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 d-flex align-items-center justify-content-center">
            {typeData === "Error" ? (
              <TiDeleteOutline size={60} color={"red"} />
            ) : (
              <GoCheckCircleFill size={50} color={"green"} />
            )}
            <span
              style={{
                marginLeft: "15px",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              {typeData}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4 px-5">
          <div className="d-flex flex-column align-items-center">
            <p
              className="text-muted fs-5 mb-0"
              style={{ lineHeight: "1.6", fontWeight: "500" }}
            >
              {modalText}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            onClick={() => setShowModal(false)}
            style={{ fontWeight: "bold" }}
          >
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopUpModal;
