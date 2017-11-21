import { fileSizeReadable } from "../utils";

const successIcon = (
  <svg width="12" height="10">
    <path
      fill="#4BD964"
      d="M4.172 6.414l-2.83-2.828L-.07 5 4.17 9.243l7.07-7.07L9.83.756"
    />
  </svg>
);

const failedIcon = (
  <svg width="10" height="10">
    <path
      fill="#FF3B30"
      d="M6.414 5l2.83-2.828L7.827.757 5 3.587 2.172.756.757 2.172 3.587 5 .756 7.828l1.415 1.415L5 6.413l2.828 2.83 1.415-1.415"
    />
  </svg>
);

const ListItem = ({
  item,
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
}) => (
  <li
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    className={selected ? "selected" : ""}
  >
    {item.name}

    {item.size && (
      <div>
        {fileSizeReadable(item.size)}
        <span className="dot" />
        {item.extension}
      </div>
    )}

    {item.status === "done" && (
      <span className="status">
        {" "}
        <svg width="12" height="10">
          <path
            fill="#4BD964"
            d="M4.172 6.414l-2.83-2.828L-.07 5 4.17 9.243l7.07-7.07L9.83.756"
          />
        </svg>
      </span>
    )}

    <style jsx>
      {`
        li {
          display: block;
          padding: 15px 35px 15px 20px;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          overflow: hidden;
          position: relative;
        }

        li:nth-child(even) {
          background: rgba(255, 255, 255, 0.3);
        }

        .file-download-status {
          position: absolute;
          right: 15px;
          top: 15px;
        }

        .selected {
          color: #fff;
        }

        .selected,
        .selected:nth-child(even) {
          background: #199fff;
        }

        .selected div {
          color: rgba(255, 255, 255, 0.8);
        }

        .selected .dot {
          background: rgba(255, 255, 255, 0.8);
        }

        .selected path {
          fill: #fff;
        }

        div {
          display: block;
          font-size: 11px;
          color: rgba(0, 0, 0, 0.6);
          padding: 5px 0;
        }

        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 4px;
          vertical-align: middle;
          background: rgba(0, 0, 0, 0.4);
          margin: 0 8px;
        }

        .status {
          position: absolute;
          right: 15px;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
        }
      `}
    </style>
  </li>
);

export default ListItem;
