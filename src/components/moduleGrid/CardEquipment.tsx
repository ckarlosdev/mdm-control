import { Card } from "react-bootstrap";
import { useEquipments } from "../../hooks/useEquipments";
import { useMemo } from "react";

type Props = {};

function CardEquipment({}: Props) {
  const { data: equipments = [] } = useEquipments();

  const stats = useMemo(() => {
    return equipments
      .filter((equip) => equip.equipmentStatus === "1" && equip.number != "E00")
      .reduce(
        (acc, equip) => {
          acc.total += 1;
          acc.byFamily[equip.family] = (acc.byFamily[equip.family] || 0) + 1;
          return acc;
        },
        {
          total: 0,
          byFamily: {} as Record<string, number>,
        },
      );
  }, [equipments]);

  //   console.log(stats);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <Card.Title className="text-center fw-bold text-uppercase text-secondary mb-3">
          Equipments
        </Card.Title>

        <div className="text-center mb-4">
          <div className="display-6 fw-bold text-primary">{stats.total}</div>
          <small className="text-muted text-uppercase fw-semibold">Total</small>
        </div>

        <hr className="my-3" />

        <div className="mb-4">
          <h6 className="text-muted fw-bold mb-2">BY CONDITION</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byFamily).map(([title, count]) => (
                <tr key={title}>
                  <td>{title}</td>
                  <td className="text-end">
                    <span className="badge bg-light text-dark">{count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardEquipment;
