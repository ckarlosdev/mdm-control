import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { RiLockPasswordLine } from "react-icons/ri";
import useUserStore from "../../stores/useUserStore";
import { generatePassword } from "../../utils/utils";
import { useState } from "react";
import { useUpdatePassword } from "../../hooks/useUsers";

type Props = {};

function ModalPassword({}: Props) {
  const {
    user,
    setShowModalPassword,
    showModalPassword,
    tempPassword,
    setTempPassword,
  } = useUserStore();

  const [copied, setCopied] = useState(false);
  const { mutate } = useUpdatePassword();

  const handleNewPassword = () => {
    const newPass = generatePassword({
      length: 8,
      includeSymbols: false,
    });

    const payload = {
      userId: user.id,
      newPassword: newPass,
    };

    mutate(payload);
    console.log(payload);

    setTempPassword(newPass);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      show={showModalPassword}
      onHide={() => setShowModalPassword(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="w-100 text-center"
          style={{ marginLeft: "32px", fontWeight: "bold" }}
        >
          <RiLockPasswordLine style={{ marginRight: "8px" }} />
          Reset Password: {user.email}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!tempPassword ? (
          <Row>
            <Col className="text-center">
              {" "}
              <Form.Label htmlFor="inputPassword5" style={{ fontSize: "23px" }}>
                Are you sure you want to reset{" "}
                <span style={{ fontWeight: "bold" }}>
                  {user.firstName + " " + user.lastName}
                </span>{" "}
                password?{" "}
              </Form.Label>
            </Col>
          </Row>
        ) : (
          <div>
            <Form.Label
              htmlFor="inputPassword5"
              style={{ display: "block", textAlign: "center" }}
            >
              Password successfully generated:
            </Form.Label>
            <div className="d-flex align-items-center justify-content-center gap-2 p-3 bg-light border rounded">
              <code style={{ fontSize: "1.5rem" }}>{tempPassword}</code>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Form.Label
              htmlFor="inputPassword5"
              style={{
                display: "block",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Provide this password to the user.
            </Form.Label>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {!tempPassword ? (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModalPassword(false)}
            >
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={handleNewPassword}>
              Generate Now
            </Button>
          </>
        ) : (
          <Button variant="success" onClick={() => setShowModalPassword(false)}>
            Understood
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalPassword;
