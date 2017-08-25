import ListItem from "./listItem";

const List = ({ results }) =>
  <ul>
    {results.map((item, index) => <ListItem key={index} item={item} />)}

    <style jsx>{`
      ul {
        height: 100%;
      }
    `}</style>
  </ul>;

export default List;
