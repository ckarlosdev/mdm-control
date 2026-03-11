import { Card } from "react-bootstrap";
import { useEmployees } from "../../hooks/useEmployees";
import { useMemo } from "react";

type Props = {};

function CardEmployee({}: Props) {
  const { data: employees = [] } = useEmployees();

  const stats = useMemo(() => {
    return employees
      .filter((emp) => emp.status === "Active")
      .reduce(
        (acc, emp) => {
          acc.byLegalName[emp.legalName] =
            (acc.byLegalName[emp.legalName] || 0) + 1;

          acc.byTitle[emp.title] = (acc.byTitle[emp.title] || 0) + 1;

          return acc;
        },
        {
          byLegalName: {} as Record<string, number>,
          byTitle: {} as Record<string, number>,
        },
      );
  }, [employees]);

  //   console.log(stats);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <Card.Title className="text-center fw-bold text-uppercase text-secondary mb-3">
          Employees
        </Card.Title>

        {/* Contador Principal */}
        <div className="text-center mb-4">
          <div className="display-6 fw-bold text-primary">
            {employees.filter((e) => e.status === "Active").length}
          </div>
          <small className="text-muted text-uppercase fw-semibold">
            Active Employees
          </small>
        </div>

        <hr className="my-3" />

        {/* Desglose por Título */}
        <div className="mb-4">
          <h6 className="text-muted fw-bold mb-2">BY TITLE</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byTitle).map(([title, count]) => (
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

        {/* Desglose por Legal Name */}
        <div>
          <h6 className="text-muted fw-bold mb-2">BY LEGAL ENTITY</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byLegalName).map(([name, count]) => (
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

export default CardEmployee;
