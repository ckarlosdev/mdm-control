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
import { useEmployees } from "../../hooks/useEmployees";
import ModalEmployee from "./ModalEmployee";
import useEmployeeStore from "../../stores/useEmployeeStore";
import { useMemo, useState } from "react";
import type { Employee } from "../../types";
import { GrUserWorker } from "react-icons/gr";

type Props = {};

interface SortConfig {
  key: keyof Employee | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: employeesData } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const { setShowModal, reset, employeeSelected } = useEmployeeStore();

  const filteredAndSortedEmployees = useMemo(() => {
    if (!employeesData) return [];

    // --- PASO 1: Filtrar ---
    let result = [...employeesData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((emp) => {
        // Buscamos coincidencia en cualquier campo relevante
        return (
          emp.employeeNumber?.toLowerCase().includes(lowSearch) ||
          emp.legalName?.toLowerCase().includes(lowSearch) ||
          emp.firstName?.toLowerCase().includes(lowSearch) ||
          emp.lastName?.toLowerCase().includes(lowSearch) ||
          emp.status?.toLowerCase().includes(lowSearch) ||
          emp.title?.toLowerCase().includes(lowSearch)
        );
      });
    }

    // --- PASO 2: Ordenar (Tu lógica actual) ---
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [employeesData, searchTerm, sortConfig]);

  const requestSort = (key: keyof Employee) => {
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

  const updateEmployee = (employeeId: number) => {
    reset();
    let emp = employeesData?.find((emp) => emp.employeesId === employeeId);
    if (emp) {
      employeeSelected(emp);
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
              <GrUserWorker style={{ marginRight: "8px" }} />
              Add Employee
            </Button>
          </Col>
          <Col xs md={4} lg={3} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>
              {"Employees"}
            </div>
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
                placeholder="Search employee..."
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
                      onClick={() => requestSort("employeeNumber")}
                      style={{ cursor: "pointer" }}
                    >
                      Number{" "}
                      {sortConfig.key === "employeeNumber" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("legalName")}
                      style={{ cursor: "pointer" }}
                    >
                      Company{" "}
                      {sortConfig.key === "legalName" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("firstName")}
                      style={{ cursor: "pointer" }}
                    >
                      First Name{" "}
                      {sortConfig.key === "firstName" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("lastName")}
                      style={{ cursor: "pointer" }}
                    >
                      Last Name{" "}
                      {sortConfig.key === "lastName" &&
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
                    <th
                      onClick={() => requestSort("title")}
                      style={{ cursor: "pointer" }}
                    >
                      Department{" "}
                      {sortConfig.key === "title" &&
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
                  {filteredAndSortedEmployees?.map((employee) => (
                    <tr
                      key={employee.employeesId}
                      className="align-middle py-3"
                    >
                      <td>
                        {employee.employeeNumber
                          ? employee.employeeNumber.substring(
                              1,
                              employee.employeeNumber.length,
                            )
                          : ""}
                      </td>
                      <td>{employee.legalName}</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>
                        {employee.status === "Active" ? (
                          <Badge bg="success">Active</Badge>
                        ) : (
                          <Badge bg="danger">Terminated</Badge>
                        )}
                      </td>
                      <td>{employee.title}</td>
                      <td>
                        <Button
                          style={{ fontWeight: "bold" }}
                          variant="outline-primary"
                          onClick={() =>
                            updateEmployee(Number(employee.employeesId))
                          }
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

      <ModalEmployee />
    </>
  );
}

export default index;
