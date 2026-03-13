import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useJobStore from "../../stores/useJobStore";
import { useJobs, useSavejob } from "../../hooks/useJobs";
import { useEffect } from "react";
import { getNextJobNumber } from "../../utils/utils";
import { MdWork } from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";

type Props = {};

function ModalJob({}: Props) {
  const { job, showModal, setShowModal, setJobData } = useJobStore();
  const {
    setShowModal: setPopUp,
    setTypeData,
    setModalText,
    user: userAuth,
  } = useAuthStore();

  const { data: jobsData } = useJobs();

  const { mutate } = useSavejob();

  const handleSave = () => {
    if (!dataValidation()) return;

    const payload = {
      ...job,
      user: userAuth?.email || "unknown",
    };

    mutate(
      { jobData: payload },
      {
        onSuccess: () => {
          setShowModal(false);
          setTypeData("Success");
          setModalText("Job data saved successfully.");
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
    console.log("validation");
    if (job.number === "") {
      alert("Job number missing.");
      return false;
    }
    if (isJobNumberDuplicated()) {
      alert("Job number already exist.");
      return false;
    }
    if (job.name === "") {
      alert("Job name missing.");
      return false;
    }
    if (job.address === "") {
      alert("Job address missing.");
      return false;
    }

    return true;
  };

  const isJobNumberDuplicated = () => {
    return jobsData?.some(
      (j) => j.number === job.number && j.jobsId !== job.jobsId,
    );
  };

  useEffect(() => {
    if (jobsData && !job.jobsId) {
      const next = getNextJobNumber(jobsData);
      setJobData("number", next);
    }
  }, [jobsData, showModal]);

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
            <MdWork style={{ marginRight: "8px" }} />
            Job
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingJobNumber" label="job number">
                <Form.Control
                  type="number"
                  placeholder="Job Number"
                  value={job.number}
                  onChange={(e) => setJobData("number", e.target.value)}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingJobName" label="Job Name">
                <Form.Control
                  type="text"
                  placeholder="Job Name"
                  value={job.name}
                  onChange={(e) => setJobData("name", e.target.value)}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingJobAddress" label="Job Address">
                <Form.Control
                  type="text"
                  placeholder="Job Address"
                  value={job.address}
                  onChange={(e) => setJobData("address", e.target.value)}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingJobType" label="Job Type">
                <Form.Select
                  aria-label="Type"
                  value={job.type}
                  onChange={(e) => {
                    setJobData("type", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="Select">Select</option>
                  <option value="Interior">Interior</option>
                  <option value="Structural">Structural</option>
                  <option value="Crushing">Crushing</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingJobStatus" label="Job Status">
                <Form.Select
                  aria-label="Status"
                  value={job.status}
                  onChange={(e) => {
                    setJobData("status", e.target.value);
                  }}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  <option value="">Select an option</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Done">Done</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingContractor" label="Contractor">
                <Form.Control
                  type="text"
                  placeholder="Contractor"
                  value={job.contractor}
                  onChange={(e) => setJobData("contractor", e.target.value)}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingContact" label="Contact">
                <Form.Control
                  type="text"
                  placeholder="Contact"
                  value={job.contact}
                  onChange={(e) => setJobData("contact", e.target.value)}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
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

export default ModalJob;
