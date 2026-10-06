import {
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { VscSearch, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import type { Job } from "../../types";
import { useJobs, useUpdateBatchStatus } from "../../hooks/useJobs";
import { useMemo, useState } from "react";
import useJobStore from "../../stores/useJobStore";
import ModalJob from "./ModalJob";
import { MdLayersClear, MdWork } from "react-icons/md";
import React from "react";

type Props = {};

interface SortConfig {
  key: keyof Job | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: jobsData } = useJobs();
  const { reset, setShowModal, jobSelected } = useJobStore();
  const { mutate: updateBatchStatus, isPending } = useUpdateBatchStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "number",
    direction: "desc",
  });

  // --- Lógica de filtrado y ordenamiento ---
  const filteredAndSortedItems = useMemo(() => {
    if (!jobsData) return [];

    let result = [...jobsData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        [
          item.number,
          item.name,
          item.type,
          item.address,
          item.contractor,
          item.contact,
          item.status,
        ].some((val) => val?.toLowerCase().includes(lowSearch)),
      );
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

  // --- Manejo de Selección Múltiple ---
  const isAllSelected = useMemo(() => {
    if (filteredAndSortedItems.length === 0) return false;
    return filteredAndSortedItems.every((item) =>
      selectedJobIds.includes(Number(item.jobsId)),
    );
  }, [filteredAndSortedItems, selectedJobIds]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredAndSortedItems.map((item) => Number(item.jobsId));
      setSelectedJobIds(allIds);
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleSelectRow = (jobId: number) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  const clearSelection = () => setSelectedJobIds([]);

  // --- Acciones de Edición ---
  const openModal = () => {
    reset();
    setShowModal(true);
  };

  const updateJob = (jobId: number) => {
    reset();
    const item = jobsData?.find((eq) => Number(eq.jobsId) === jobId);
    if (item) {
      jobSelected(item);
      setShowModal(true);
    }
  };

  const handleBulkStatusChange = (newStatus: Job["status"]) => {
    updateBatchStatus(
      { ids: selectedJobIds, status: newStatus },
      {
        onSuccess: () => {
          setSelectedJobIds([]); // Limpia la selección al terminar con éxito
        },
        onError: (error) => {
          console.error("Error actualizando estados en lote:", error);
        },
      },
    );
  };

  const requestSort = (key: keyof Job) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <Container fluid>
        {/* Barra superior de herramientas / Acciones en Lote */}
        <Row className="mb-3 align-items-center">
          <Col md={4} className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              style={{ fontWeight: "bold" }}
              onClick={openModal}
            >
              <MdWork style={{ marginRight: "8px" }} />
              Add Job
            </Button>

            {/* Barra de Edición Masiva (Se activa si hay elementos seleccionados) */}
            {selectedJobIds.length > 0 && (
              <div className="d-flex align-items-center gap-2 bg-light p-1 px-2 rounded border">
                <span className="fw-bold fs-7 text-secondary">
                  {selectedJobIds.length} selected
                </span>

                <DropdownButton
                  id="dropdown-bulk-status"
                  title={isPending ? "Updating..." : "Change Status"}
                  disabled={isPending}
                  size="sm"
                  variant="primary"
                >
                  <Dropdown.Item
                    onClick={() => handleBulkStatusChange("Pending")}
                  >
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleBulkStatusChange("In Progress")}
                  >
                    In Progress
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBulkStatusChange("Done")}>
                    Done
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleBulkStatusChange("On Hold")}
                  >
                    On Hold
                  </Dropdown.Item>
                </DropdownButton>

                <Button
                  variant="link"
                  size="sm"
                  className="text-decoration-none text-muted p-0 ms-1"
                  onClick={clearSelection}
                  title="Clear selection"
                >
                  <MdLayersClear size={18} />
                </Button>
              </div>
            )}
          </Col>

          <Col md={4} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>Job</div>
          </Col>

          <Col md={4}>
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

        {/* Tabla */}
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
                    {/* Checkbox Select All */}
                    <th style={{ width: "40px" }}>
                      <Form.Check
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all jobs"
                      />
                    </th>

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
                  {filteredAndSortedItems?.map((equipment) => {
                    const isSelected = selectedJobIds.includes(
                      Number(equipment.jobsId),
                    );
                    return (
                      <tr
                        key={equipment.jobsId}
                        className={`align-middle py-3 ${isSelected ? "table-active" : ""}`}
                      >
                        {/* Checkbox por fila */}
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleSelectRow(Number(equipment.jobsId))
                            }
                            aria-label={`Select job ${equipment.number}`}
                          />
                        </td>
                        <td>{equipment.number}</td>
                        <td>{equipment.name}</td>
                        <td>{equipment.type}</td>
                        <td>{equipment.address}</td>
                        <td>{equipment.contractor}</td>
                        <td>{equipment.contact}</td>
                        <td>
                          <StatusBadge status={equipment.status} />
                        </td>
                        <td>
                          {/* Deshabilitar o esconder si hay selección masiva activa para evitar inconsistencias */}
                          <Button
                            style={{ fontWeight: "bold" }}
                            variant="outline-primary"
                            size="sm"
                            disabled={selectedJobIds.length > 1}
                            onClick={() => updateJob(Number(equipment.jobsId))}
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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

// Componente auxiliar para reducir renderizados y limpiar el JSX principal
const StatusBadge = React.memo(({ status }: { status: Job["status"] }) => {
  switch (status) {
    case "Pending":
      return <Badge bg="secondary">Pending</Badge>;
    case "In Progress":
      return <Badge bg="primary">In Progress</Badge>;
    case "Done":
      return <Badge bg="success">Done</Badge>;
    case "On Hold":
      return <Badge bg="warning">On Hold</Badge>;
    default:
      return <Badge bg="dark">?</Badge>;
  }
});

export default index;
