import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { VscSearch, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import type { Job } from "../../types";
import { useJobs } from "../../hooks/useJobs";
import { useMemo, useState } from "react";
import useJobStore from "../../stores/useJobStore";
import ModalJob from "./ModalJob";
import { MdWork } from "react-icons/md";

type Props = {};

interface SortConfig {
  key: keyof Job | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: jobsData } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");

  const { reset, setShowModal, jobSelected } = useJobStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "number",
    direction: "desc",
  });

  const filteredAndSortedItems = useMemo(() => {
    if (!jobsData) return [];

    let result = [...jobsData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return (
          item.number?.toLowerCase().includes(lowSearch) ||
          item.name?.toLowerCase().includes(lowSearch) ||
          item.type?.toLowerCase().includes(lowSearch) ||
          item.address?.toLowerCase().includes(lowSearch) ||
          item.contractor?.toLowerCase().includes(lowSearch) ||
          item.contact?.toLowerCase().includes(lowSearch) ||
          item.status?.toLowerCase().includes(lowSearch)
        );
      });
    }

    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];

        if (aValue == null || bValue == null) return 0;

        if (key === "number") {
          const numA = parseFloat(String(aValue));
          const numB = parseFloat(String(bValue));

          // Validamos que ambos sean números válidos para evitar errores de NaN
          if (!isNaN(numA) && !isNaN(numB)) {
            aValue = numA;
            bValue = numB;
          }
        }

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [jobsData, searchTerm, sortConfig]);

  const requestSort = (key: keyof Job) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openModal = () => {
    reset();
    setShowModal(true);
  };

  const updateJob = (jobId: number) => {
    reset();
    let item = jobsData?.find((eq) => eq.jobsId === jobId);
    if (item) {
      jobSelected(item);
      setShowModal(true);
    }
  };

  return (
    <>
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-primary"
              style={{ fontWeight: "bold" }}
              onClick={openModal}
            >
              <MdWork style={{ marginRight: "8px" }} />
              Add Job
            </Button>
          </Col>
          <Col xs md={4} lg={3} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>{"Job"}</div>
          </Col>
          <Col>
            <div className="d-flex align-items-center justify-content-end h-100">
              <Form.Control
                type="text"
                id="inputSearch"
                style={{
                  fontWeight: "bold",
                  width: "300px",
                  textAlign: "center",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job..."
              />
              <VscSearch style={{ marginLeft: "8px" }} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div
              style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
            >
              <Table striped bordered hover size="sm">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 10,
                    boxShadow: "inset 0 -1px 0 #dee2e6",
                  }}
                >
                  <tr style={{ textAlign: "center" }}>
                    <th
                      onClick={() => requestSort("number")}
                      style={{ cursor: "pointer" }}
                    >
                      Number{" "}
                      {sortConfig.key === "number" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("type")}
                      style={{ cursor: "pointer" }}
                    >
                      Type{" "}
                      {sortConfig.key === "type" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("address")}
                      style={{ cursor: "pointer" }}
                    >
                      Address{" "}
                      {sortConfig.key === "address" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("contractor")}
                      style={{ cursor: "pointer" }}
                    >
                      Contractor{" "}
                      {sortConfig.key === "contractor" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("contact")}
                      style={{ cursor: "pointer" }}
                    >
                      Contact{" "}
                      {sortConfig.key === "contact" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("status")}
                      style={{ cursor: "pointer" }}
                    >
                      Status{" "}
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {filteredAndSortedItems?.map((equipment) => (
                    <tr key={equipment.jobsId} className="align-middle py-3">
                      <td>{equipment.number}</td>
                      <td>{equipment.name}</td>
                      <td>{equipment.type}</td>
                      <td>{equipment.address}</td>
                      <td>{equipment.contractor}</td>
                      <td>{equipment.contact}</td>
                      <td>
                        {equipment.status === "Pending" ? (
                          <Badge bg="secondary">Pending</Badge>
                        ) : equipment.status === "In Progress" ? (
                          <Badge bg="primary">In Progress</Badge>
                        ) : equipment.status === "Done" ? (
                          <Badge bg="success">Done</Badge>
                        ) : equipment.status === "On Hold" ? (
                          <Badge bg="warning">On Hold</Badge>
                        ) : (
                          <Badge bg="dark">?</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          style={{ fontWeight: "bold" }}
                          variant="outline-primary"
                          onClick={() => updateJob(Number(equipment.jobsId))}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      <ModalJob />
    </>
  );
}

export default index;
