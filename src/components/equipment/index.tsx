import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { TbDownload, TbForklift } from "react-icons/tb";
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
  const [selectedFamily, setSelectedFamily] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { reset, setShowModal, setShowModalQr, equipmentSelected } =
    useEquipmentStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const filteredAndSortedEquipment = useMemo(() => {
    if (!equipmentsData) return [];

    let result = [...equipmentsData];

    // 1. Filtrado por estado del equipo (equipmentStatus === "1")
    result = result.filter((equip) => equip.number != "E00");

    // 2. Búsqueda por texto general
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((equip) => {
        return (
          equip.number?.toLowerCase().includes(lowSearch) ||
          equip.family?.toLowerCase().includes(lowSearch) ||
          equip.name?.toLowerCase().includes(lowSearch) ||
          equip.manufacturing?.toLowerCase().includes(lowSearch) ||
          equip.model?.toLowerCase().includes(lowSearch) ||
          equip.year?.toLowerCase().includes(lowSearch) ||
          equip.condition?.toLowerCase().includes(lowSearch) ||
          equip.serialNumber?.toLowerCase().includes(lowSearch) ||
          equip.equipmentStatus?.toLowerCase().includes(lowSearch)
        );
      });
    }

    if (selectedFamily) {
      result = result.filter((equip) => equip.family === selectedFamily);
    }

    // 3. Ordenamiento (si no hay sortConfig.key, usa "number" y "asc" por defecto)
    const key = sortConfig.key || "number";
    const direction = sortConfig.direction || "asc";

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });

    result.sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Valores nulos/indefinidos al final
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Ordenamiento natural para "number" o cualquier texto
      if (
        key === "number" ||
        (typeof aValue === "string" && typeof bValue === "string")
      ) {
        const strA = String(aValue);
        const strB = String(bValue);

        return direction === "asc"
          ? collator.compare(strA, strB)
          : collator.compare(strB, strA);
      }

      // Ordenamiento numérico estándar para otros datos (Ej. Odómetro, Horas)
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [equipmentsData, searchTerm, selectedFamily, sortConfig]);

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
  };

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

  const exportarTodosLosQR = async () => {
    if (!filteredAndSortedEquipment || filteredAndSortedEquipment.length === 0)
      return;

    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4", // 210 x 297 mm
      });

      // --- CONFIGURACIÓN ULTRA-COMPACTA (Para meter la mayor cantidad de QRs por página) ---
      const marginX = 8; // Margen izquierdo y derecho de la hoja
      const marginY = 10; // Margen superior e inferior
      const cardWidth = 26; // Ancho de cada mini-tarjeta
      const cardHeight = 32; // Alto de cada mini-tarjeta
      const qrSize = 22; // Tamaño del código QR (muy legible para cámaras modernas)
      const cols = 7; // 7 columnas horizontales
      const rowsPerPage = 8; // 8 filas verticales (Total: 56 QRs por página A4)

      // Distribución automática de los espacios intermedios (gaps)
      const gapX = (210 - marginX * 2 - cardWidth * cols) / (cols - 1);
      const gapY =
        (297 - marginY * 2 - cardHeight * rowsPerPage) / (rowsPerPage - 1);

      let currentCol = 0;
      let currentRow = 0;

      for (let i = 0; i < filteredAndSortedEquipment.length; i++) {
        const equip = filteredAndSortedEquipment[i];

        // 1. Generar la URL del QR
        const qrText = `https://oleo-soft.com/index.html?id=${equip.equipmentsId}&name=${equip.name}&number=${equip.number}`;

        // 2. Crear el QR en memoria con márgenes internos de 0 para aprovechar el espacio
        const qrDataUrl = await QRCode.toDataURL(qrText, {
          margin: 0,
          width: 150,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        // 3. Calcular la posición exacta en el canvas PDF
        const x = marginX + currentCol * (cardWidth + gapX);
        const y = marginY + currentRow * (cardHeight + gapY);

        // (Opcional) Línea divisoria muy tenue para recortar con tijera/guillotina
        doc.setDrawColor(230, 230, 230);
        doc.rect(x, y, cardWidth, cardHeight);

        // 4. Dibujar el QR centrado horizontalmente dentro de su celda
        const qrX = x + (cardWidth - qrSize) / 2;
        doc.addImage(qrDataUrl, "PNG", qrX, y + 2, qrSize, qrSize);

        // 5. Dibujar el número del equipo abajo del QR
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5); // Tamaño de fuente pequeño pero muy legible al imprimir

        // Limpiar el número de caracteres no deseados
        const cleanNumber = equip.number
          ? equip.number.replace(/\D/g, "")
          : "N/A";
        doc.text(cleanNumber, x + cardWidth / 2, y + qrSize + 6, {
          align: "center",
        });

        // 6. Manejo de la cuadrícula y saltos de página
        currentCol++;
        if (currentCol >= cols) {
          currentCol = 0;
          currentRow++;
        }

        // Si llenamos la página actual (56 QRs) y quedan más equipos, creamos otra página
        if (
          currentRow >= rowsPerPage &&
          i < filteredAndSortedEquipment.length - 1
        ) {
          doc.addPage();
          currentRow = 0;
          currentCol = 0;
        }
      }

      // Guardar el PDF optimizado
      doc.save("equipments-qr-codes.pdf");
    } catch (error) {
      console.error("Error generando el PDF de QRs compactos:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <Container fluid>
        <Row className="mb-3">
          <Col className="d-flex justify-content-start">
            <ButtonGroup>
              <Button
                variant="outline-primary"
                className="d-inline-flex align-items-center px-3 py-2 fw-bold"
                onClick={openModal}
              >
                <TbForklift className="me-2 fs-5" />
                Add Equipment
              </Button>

              <Button
                variant="outline-success"
                className="d-inline-flex align-items-center px-3 py-2 fw-bold"
                onClick={exportarTodosLosQR}
                disabled={isGeneratingPdf || !filteredAndSortedEquipment.length}
              >
                <TbDownload className="me-2 fs-5" />
                {isGeneratingPdf ? "Generating PDF..." : "Export all QRs (PDF)"}
              </Button>
            </ButtonGroup>
          </Col>
          <Col>
            <div className="d-flex align-items-center justify-content-end gap-2 h-100">
              <Form.Select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                style={{
                  width: "180px",
                  fontWeight: "500",
                }}
              >
                <option value="">All Types</option>
                <option value="Equipment">Equipments</option>
                <option value="Heavy Truck">Heavy Trucks</option>
                <option value="Light Truck">Light Trucks</option>
                <option value="Semi Trailer">Semi Trailers</option>
                <option value="Trailer">Trailers</option>
              </Form.Select>

              <div className="d-flex align-items-center">
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
                      Type{" "}
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
                    <th
                      onClick={() => requestSort("equipmentStatus")}
                      style={{ cursor: "pointer" }}
                    >
                      Status{" "}
                      {sortConfig.key === "equipmentStatus" &&
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
                      <td>{equipment.number}</td>
                      <td>{equipment.family}</td>
                      <td>{equipment.name}</td>
                      <td>{equipment.manufacturing}</td>
                      <td>{equipment.model}</td>
                      <td>{equipment.year}</td>
                      <td>{equipment.condition}</td>
                      <td>{equipment.serialNumber}</td>
                      <td>{equipment.hour}</td>
                      <td>
                        <Badge
                          pill
                          bg={
                            equipment.equipmentStatus === "1"
                              ? "success"
                              : "secondary"
                          }
                          className="d-inline-flex align-items-center gap-2 px-2 py-2"
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "currentColor",
                            }}
                          />
                          {equipment.equipmentStatus === "1"
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>
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
