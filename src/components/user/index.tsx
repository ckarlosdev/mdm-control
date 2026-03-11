import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { VscSearch, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import type { User } from "../../types";
import { useMemo, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import ModalUserUpdate from "./ModalUserUpdate";
import ModalUserCreation from "./ModalUserCreation";
import useUserStore from "../../stores/useUserStore";
import { RiLockPasswordFill } from "react-icons/ri";
import ModalPassword from "./ModalPassword";

type Props = {};

interface SortConfig {
  key: keyof User | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: usersData } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    setShowModalCreate,
    setShowModalUpdate,
    setShowModalPassword,
    resetCreation,
    resetUpdate,
    userSelected,
    setTempPassword,
  } = useUserStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const filteredAndSortedItems = useMemo(() => {
    if (!usersData) return [];

    let result = [...usersData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return (
          item.firstName?.toLowerCase().includes(lowSearch) ||
          item.lastName?.toLowerCase().includes(lowSearch) ||
          item.email?.toLowerCase().includes(lowSearch)
          // ||
          // item.isActive?.toLowerCase().includes(lowSearch)
        );
      });
    }

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
  }, [usersData, searchTerm, sortConfig]);

  const requestSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const updateUser = (userId: string) => {
    resetUpdate();
    let user = usersData?.find((us) => us.id === userId);
    if (user) {
      userSelected(user);
      setShowModalUpdate(true);
    }
  };

  const resetPassword = (userId: string) => {
    let user = usersData?.find((us) => us.id === userId);
    if (user) {
      setTempPassword("");
      userSelected(user);
      setShowModalPassword(true);
    }
  };

  const renderUpdateUser = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Update user
    </Tooltip>
  );

  const renderPasword = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Reset password
    </Tooltip>
  );

  // console.log(usersData);

  return (
    <>
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-primary"
              style={{ fontWeight: "bold" }}
              onClick={() => {
                resetCreation();
                setShowModalCreate(true);
              }}
            >
              <FaUserPlus style={{ marginRight: "8px" }} />
              Add User
            </Button>
          </Col>
          <Col xs md={4} lg={3} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>
              {"Users"}
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
                placeholder="Search user..."
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
                      onClick={() => requestSort("email")}
                      style={{ cursor: "pointer" }}
                    >
                      Email{" "}
                      {sortConfig.key === "email" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("isActive")}
                      style={{ cursor: "pointer" }}
                    >
                      Status{" "}
                      {sortConfig.key === "isActive" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th>Role</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {(() => {
                    console.log(
                      "¿Qué es filteredAndSortedItems?",
                      filteredAndSortedItems,
                    );

                    if (!Array.isArray(filteredAndSortedItems)) {
                      console.warn(
                        "filteredAndSortedItems no es un array todavía",
                      );
                      return null; // O un <Spinner />
                    }

                    return filteredAndSortedItems.map((item) => (
                      <tr key={item.id} className="align-middle py-3">
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.email}</td>
                        <td>
                          {item.isActive ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="danger">Inactive</Badge>
                          )}
                        </td>
                        <td>
                          {item.roles.map((r) => (
                            <Badge
                              key={r}
                              bg={
                                r === "ROLE_ADMIN"
                                  ? "success"
                                  : r === "ROLE_SUPERVISOR"
                                    ? "primary"
                                    : "secondary"
                              }
                            >
                              {r === "ROLE_ADMIN"
                                ? "ADMIN"
                                : r === "ROLE_SUPERVISOR"
                                  ? "SUPERVISOR"
                                  : "USER"}
                            </Badge>
                          ))}
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderPasword}
                          >
                            <Button
                              style={{ fontWeight: "bold" }}
                              variant="outline-danger"
                              onClick={() => resetPassword(item.id)}
                            >
                              <RiLockPasswordFill />
                              {/* Reset */}
                            </Button>
                          </OverlayTrigger>
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderUpdateUser}
                          >
                            <Button
                              style={{ fontWeight: "bold" }}
                              variant="outline-primary"
                              onClick={() => updateUser(item.id)}
                            >
                              <FaUserEdit />
                              {/* Update */}
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      <ModalUserUpdate />
      <ModalUserCreation />
      <ModalPassword />
    </>
  );
}

export default index;
