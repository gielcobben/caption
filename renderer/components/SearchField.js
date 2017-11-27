import PropTypes from "prop-types";

class SearchField extends React.Component {
  render() {
    const {
      value,
      placeholder,
      onSubmit,
      onChange,
      onFocus,
      onBlur,
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          value={value}
          type="search"
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={input => {
            this.textInput = input;
          }}
        />

        <style jsx>
          {`
            form {
              display: flex;
              align-items: center;
            }

            input {
              font-size: 24px;
              font-weight: 300;
              width: 100%;
              appearence: none;
              border: none;
              outline: none;
              line-height: normal;
            }

            ::-webkit-input-placeholder {
              text-align: center;
              color: rgba(0, 0, 0, 0.2);
            }
          `}
        </style>
      </form>
    );
  }
}

SearchField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default SearchField;
