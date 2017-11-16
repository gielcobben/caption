import { fileSizeReadable } from "../utils";

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
    {item.filename}

    {item.size && (
      <div>
        {fileSizeReadable(item.size)}
        <span />
        {item.extension}
      </div>
    )}

    <style jsx>{`
      li {
        display: block;
        padding: 15px 20px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      li:nth-child(even) {
        background: rgba(255, 255, 255, 0.3);
      }

      .selected {
        color: #fff;
      }

      .selected,
      .selected:nth-child(even) {
        background: #199fff;
      }

      div {
        display: block;
        font-size: 11px;
        color: rgba(0, 0, 0, 0.6);
        padding: 5px 0;
      }

      span {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        vertical-align: middle;
        background: rgba(0, 0, 0, 0.4);
        margin: 0 8px;
      }
    `}
    </style>
  </li>
);

export default ListItem;
