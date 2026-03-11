import { Card } from "react-bootstrap";
import { useUsers } from "../../hooks/useUsers";
import { useMemo } from "react";

type Props = {};

function CardUser({}: Props) {
  const { data: users = [] } = useUsers();

  const stats = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        user.roles.forEach((rol) => {
          // Inicializamos o sumamos 1 por cada rol encontrado
          acc.byRole[rol] = (acc.byRole[rol] || 0) + 1;
        });

        return acc;
      },
      {
        byRole: {} as Record<string, number>,
      },
    );
  }, [users]);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <Card.Title className="text-center fw-bold text-uppercase text-secondary mb-3">
          USERS
        </Card.Title>

        <div className="text-center mb-4">
          <div className="display-6 fw-bold text-primary">
            {users.filter((e) => e.isActive).length}
          </div>
          <small className="text-muted text-uppercase fw-semibold">Total</small>
        </div>

        <div>
          <h6 className="text-muted fw-bold mb-2">BY LEGAL ENTITY</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byRole).map(([name, count]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td className="text-end">
                    <span className="badge bg-primary rounded-pill">
                      {count}
                    </span>
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

export default CardUser;
