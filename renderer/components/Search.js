import PropTypes from "prop-types";
import { shell } from "electron";
import FilePath from "./FilePath";
import SearchField from "./SearchField";

class Search extends React.Component {
  render() {
    const {
      value,
      placeholder,
      dropFilePath,
      dropFilePathClean,
      onSubmit,
      onChange,
      onFocus,
      onBlur,
    } = this.props;

    return (
      <section>
        {dropFilePath && (
          <FilePath
            dropFilePath={dropFilePath}
            dropFilePathClean={dropFilePathClean}
          />
        )}

        {!dropFilePath && (
          <SearchField
            value={value}
            placeholder={placeholder}
            onSubmit={onSubmit}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={searchField => {
              this.searchField = searchField;
            }}
          />
        )}

        <style jsx>
          {`
            section {
              background: #fff;
              padding: 0px 12px 12px 12px;
              box-shadow: 0px 0.5px 0px #cacbcc;
              font-size: 24px;
              font-weight: 300;
            }
          `}
        </style>
      </section>
    );
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  dropFilePath: PropTypes.string.isRequired,
  dropFilePathClean: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Search;
