import { Card } from "react-bootstrap";
import { useJobs } from "../../hooks/useJobs";
import { useMemo } from "react";

type Props = {};

function CardJob({}: Props) {
  const { data: jobs = [] } = useJobs();

  const stats = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc.byStatus[job.status] = (acc.byStatus[job.status] || 0) + 1;
        acc.byType[job.type] = (acc.byType[job.type] || 0) + 1;

        return acc;
      },
      {
        byType: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
      },
    );
  }, [jobs]);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <Card.Title className="text-center fw-bold text-uppercase text-secondary mb-3">
          Jobs
        </Card.Title>

        <div className="text-center mb-4">
          <div className="display-6 fw-bold text-primary">{jobs.length}</div>
          <small className="text-muted text-uppercase fw-semibold">
            Total
          </small>
        </div>

        <hr className="my-3" />

        <div className="mb-4">
          <h6 className="text-muted fw-bold mb-2">BY TYPE</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byType).map(([name, count]) => (
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

        <div>
          <h6 className="text-muted fw-bold mb-2">BY STATUS</h6>
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(stats.byStatus).map(([title, count]) => (
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

export default CardJob;
