import { Card } from "react-bootstrap";
import { useAttachments } from "../../hooks/useAttachments";
import { useMemo } from "react";

type Props = {};

function CardAttachment({}: Props) {
  const { data: attachments = [] } = useAttachments();

  const stats = useMemo(() => {
    return attachments.reduce(
      (acc, attach) => {
        acc.byFamily[attach.family] = (acc.byFamily[attach.family] || 0) + 1;
        return acc;
      },
      {
        byFamily: {} as Record<string, number>,
      },
    );
  }, [attachments]);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <Card.Title className="text-center fw-bold text-uppercase text-secondary mb-3">
          Atachments
        </Card.Title>

        <div className="text-center mb-4">
          <div className="display-6 fw-bold text-primary">
            {attachments.length}
          </div>
          <small className="text-muted text-uppercase fw-semibold">
            Total
          </small>
        </div>

        <hr className="my-3" />

        <div className="mb-4">
          <h6 className="text-muted fw-bold mb-2">BY FAMILY</h6>
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

export default CardAttachment;
