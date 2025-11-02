import { OverlayTrigger, Popover } from "react-bootstrap";
import { FaTags } from "react-icons/fa";
import "./tagsPopover.scss";

const TagsPopover = ({ tags }: { tags: string[] }) => {
  const popover = (
    <Popover id="tags-popover" className="tags-popover-custom">
      <Popover.Header className="tags-popover-header">
        <div className="tags-header-content">
          <div className="tags-title">
            <FaTags className="tags-icon" />
            <span>Product Tags</span>
          </div>
          <span className="tags-count">{tags.length} tags</span>
        </div>
      </Popover.Header>
      <Popover.Body className="tags-popover-body">
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-badge">
              {tag}
            </span>
          ))}
          {tags.length === 0 && (
            <span className="no-tags">No tags available</span>
          )}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={popover}
      rootClose
    >
      <button className="action-btn" title="View Tags">
        <FaTags />
      </button>
    </OverlayTrigger>
  );
};

export default TagsPopover;
