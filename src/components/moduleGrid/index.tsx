import { Container } from "react-bootstrap";
import CardEmployee from "./CardEmployee";
import CardEquipment from "./CardEquipment";
import CardAttachment from "./CardAttachment";
import CardJob from "./CardJob";
import CardUser from "./CardUser";
import Masonry from "react-masonry-css";
import "../../styles/moduleGrid.css";
import { useEmployees } from "../../hooks/useEmployees";
import { useEquipments } from "../../hooks/useEquipments";
import { useAttachments } from "../../hooks/useAttachments";
import { useJobs } from "../../hooks/useJobs";
import { useUsers } from "../../hooks/useUsers";

type Props = {};

const breakpointColumnsObj = {
  default: 3, // 3 columnas en pantallas grandes (Desktop)
  1200: 3, // 3 columnas hasta los 1200px
  992: 2, // 2 columnas en tablets/laptops pequeñas
  768: 1, // 1 columna en móviles (estilo lista)
};

function index({}: Props) {
  const { data: employees } = useEmployees();
  const { data: equipments } = useEquipments();
  const { data: attachments } = useAttachments();
  const { data: jobs } = useJobs();
  const { data: users } = useUsers();

  const myKey =
    (employees?.length || 0) +
    (equipments?.length || 0) +
    (attachments?.length || 0) +
    (jobs?.length || 0) +
    (users?.length || 0);

  return (
    <Container fluid className="py-4">
      <Masonry
        key={myKey}
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {/* Tus componentes directos */}
        <CardJob />

        <CardEquipment />
        <CardAttachment />

        <CardUser />
        <CardEmployee />
      </Masonry>
    </Container>
  );
}

export default index;
