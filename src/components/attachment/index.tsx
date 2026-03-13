import { useMemo, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { VscSearch, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import type { Attachment } from "../../types";
import { useAttachments } from "../../hooks/useAttachments";
import ModalAttachment from "./ModalAttachment";
import useAttachmentStore from "../../stores/useAttachmentStore";
import { GiGears } from "react-icons/gi";
import { ImQrcode } from "react-icons/im";
import { BsPencilSquare } from "react-icons/bs";
import ModalQrCode from "./ModalQrCode";

type Props = {};

interface SortConfig {
  key: keyof Attachment | null;
  direction: "asc" | "desc";
}

function index({}: Props) {
  const { data: attachmentsData } = useAttachments();
  const [searchTerm, setSearchTerm] = useState("");
  const { reset, setShowModal, setShowModalQr, attachmentSelected } = useAttachmentStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const filteredAndSortedItems = useMemo(() => {
    if (!attachmentsData) return [];

    let result = [...attachmentsData];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return (
          item.number?.toLowerCase().includes(lowSearch) ||
          item.name?.toLowerCase().includes(lowSearch) ||
          item.manufacturing?.toLowerCase().includes(lowSearch) ||
          item.model?.toLowerCase().includes(lowSearch) ||
          item.year?.toLowerCase().includes(lowSearch) ||
          item.conditions?.toLowerCase().includes(lowSearch) ||
          item.serialNumber?.toLowerCase().includes(lowSearch)
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
  }, [attachmentsData, searchTerm, sortConfig]);

  const requestSort = (key: keyof Attachment) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openModal = () => {
    console.log("open modal");
    reset();
    setShowModal(true);
  };

  const updateAttachment = (attachmentId: number) => {
    reset();
    let attach = attachmentsData?.find(
      (eq) => eq.attachmentsId === attachmentId,
    );
    if (attach) {
      attachmentSelected(attach);
      setShowModal(true);
    }
  };

  const handleQr = (attachmentId: number) => {
    reset();
    let attach = attachmentsData?.find(
      (eq) => eq.attachmentsId === attachmentId,
    );
    if (attach) {
      console.log("3");
      attachmentSelected(attach);
      setShowModalQr(true);
    }
  };

  const renderUpdate = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Update attachment data
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
              <GiGears style={{ marginRight: "8px" }} />
              Add Attachment
            </Button>
          </Col>
          <Col xs md={4} lg={3} className="text-center">
            <div style={{ fontWeight: "bold", fontSize: "30px" }}>
              {"Attachments"}
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
                placeholder="Search attachment..."
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
                      onClick={() => requestSort("family")}
                      style={{ cursor: "pointer" }}
                    >
                      Family{" "}
                      {sortConfig.key === "family" &&
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
                      onClick={() => requestSort("conditions")}
                      style={{ cursor: "pointer" }}
                    >
                      Condition{" "}
                      {sortConfig.key === "conditions" &&
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
                    <th>QR</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {filteredAndSortedItems?.map((item) => (
                    <tr key={item.attachmentsId} className="align-middle py-3">
                      <td>{item.number.replace(/\D/g, "")}</td>
                      <td>{item.family}</td>
                      <td>{item.name}</td>
                      <td>{item.manufacturing}</td>
                      <td>{item.model}</td>
                      <td>{item.year}</td>
                      <td>{item.conditions}</td>
                      <td>{item.serialNumber}</td>
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
                              handleQr(Number(item.attachmentsId))
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
                              updateAttachment(Number(item.attachmentsId))
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

      <ModalAttachment />
      <ModalQrCode />
    </>
  );
}

export default index;
