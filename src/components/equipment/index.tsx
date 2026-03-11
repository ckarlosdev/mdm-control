import {
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { TbForklift } from "react-icons/tb";
import { VscSearch, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { useEquipments } from "../../hooks/useEquipments";
import type { Equipment } from "../../types";
import { useMemo, useState } from "react";
import useEquipmentStore from "../../stores/useEquipmentStore";
import ModalEquipment from "./ModalEquipment";
import { ImQrcode } from "react-icons/im";
import { BsPencilSquare } from "react-icons/bs";
import ModalQrCode from "./ModalQrCode";

type Props = {};

interface SortConfig {
  key: keyof Equipment | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: equipmentsData } = useEquipments();
  const [searchTerm, setSearchTerm] = useState("");

  const { reset, setShowModal, setShowModalQr, equipmentSelected } = useEquipmentStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const filteredAndSortedEquipment = useMemo(() => {
    if (!equipmentsData) return [];

    let result = [...equipmentsData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((equip) => {
        return (
          equip.number?.toLowerCase().includes(lowSearch) ||
          equip.name?.toLowerCase().includes(lowSearch) ||
          equip.manufacturing?.toLowerCase().includes(lowSearch) ||
          equip.model?.toLowerCase().includes(lowSearch) ||
          equip.year?.toLowerCase().includes(lowSearch) ||
          equip.condition?.toLowerCase().includes(lowSearch) ||
          equip.serialNumber?.toLowerCase().includes(lowSearch)
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
  }, [equipmentsData, searchTerm, sortConfig]);

  const requestSort = (key: keyof Equipment) => {
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

  const updateEquipment = (equipmentId: number) => {
    reset();
    let equip = equipmentsData?.find((eq) => eq.equipmentsId === equipmentId);
    if (equip) {
      equipmentSelected(equip);
      setShowModal(true);
    }
  };

  const handleQrCode = (equipmentId: number) => {
    reset();
    let equip = equipmentsData?.find((eq) => eq.equipmentsId === equipmentId);
    if (equip) {
      equipmentSelected(equip);
      setShowModalQr(true);
    }
  }

  const renderUpdate = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Update equipment data
    </Tooltip>
  );

  const renderQr = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Generate QR Code
    </Tooltip>
  );

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
              <TbForklift style={{ marginRight: "8px" }} />
              Add Equipment
            </Button>
          </Col>
          <Col xs md={4} lg={3} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>
              {"Equipments"}
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
                placeholder="Search equipment..."
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
                      onClick={() => requestSort("manufacturing")}
                      style={{ cursor: "pointer" }}
                    >
                      Manufacturing{" "}
                      {sortConfig.key === "manufacturing" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("model")}
                      style={{ cursor: "pointer" }}
                    >
                      Model{" "}
                      {sortConfig.key === "model" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("year")}
                      style={{ cursor: "pointer" }}
                    >
                      Year{" "}
                      {sortConfig.key === "year" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("condition")}
                      style={{ cursor: "pointer" }}
                    >
                      Condition{" "}
                      {sortConfig.key === "condition" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("serialNumber")}
                      style={{ cursor: "pointer" }}
                    >
                      Serial N.{" "}
                      {sortConfig.key === "serialNumber" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th
                      onClick={() => requestSort("hour")}
                      style={{ cursor: "pointer" }}
                    >
                      Odometer{" "}
                      {sortConfig.key === "hour" &&
                        (sortConfig.direction === "asc" ? (
                          <VscTriangleUp />
                        ) : (
                          <VscTriangleDown />
                        ))}
                    </th>
                    <th>QR</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {filteredAndSortedEquipment?.map((equipment) => (
                    <tr
                      key={equipment.equipmentsId}
                      className="align-middle py-3"
                    >
                      <td>{equipment.number.replace(/\D/g, "")}</td>
                      <td>{equipment.name}</td>
                      <td>{equipment.manufacturing}</td>
                      <td>{equipment.model}</td>
                      <td>{equipment.year}</td>
                      <td>{equipment.condition}</td>
                      <td>{equipment.serialNumber}</td>
                      <td>{equipment.hour}</td>
                      <td>
                        <OverlayTrigger
                          placement="left"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderQr}
                        >
                          <Button
                            style={{ fontWeight: "bold" }}
                            variant="outline-primary"
                            onClick={() =>
                              handleQrCode(Number(equipment.equipmentsId))
                            }
                          >
                            <ImQrcode />
                          </Button>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="left"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderUpdate}
                        >
                          <Button
                            style={{ fontWeight: "bold" }}
                            variant="outline-primary"
                            onClick={() =>
                              updateEquipment(Number(equipment.equipmentsId))
                            }
                          >
                            <BsPencilSquare />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      <ModalEquipment />
      <ModalQrCode />
    </>
  );
}

export default index;
