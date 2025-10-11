import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCommentDots } from "react-icons/fa";
import "./commentTooltip.scss";

function CommentTooltip({ comment }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="comment-tooltip" className="custom-comment-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-header">
              <FaCommentDots className="header-icon" />
              <span>Comment</span>
            </div>
            <div className="tooltip-message">{comment}</div>
          </div>
        </Tooltip>
      }
    >
      <span className="comment-trigger">
        <FaCommentDots />
      </span>
    </OverlayTrigger>
  );
}

export default CommentTooltip;