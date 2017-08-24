import { fileSizeReadable } from "../utils";

const ListItem = ({ file }) =>
  <li>
    {file.name}

    {file.size &&
      <div>
        {fileSizeReadable(file.size)}
        <span />
        {file.extention}
      </div>}

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
        background: rgba(255, 255, 255, .3);
      }

      div {
        display: block;
        font-size: 11px;
        color: rgba(0, 0, 0, .6);
        padding: 5px 0;
      }

      span {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        vertical-align: middle;
        background: rgba(0, 0, 0, .4);
        margin: 0 8px;
      }
    `}</style>
  </li>;

export default ListItem;
