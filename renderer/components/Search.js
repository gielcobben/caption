const Search = ({ placeholder, onChange, onFocus, onBlur }) =>
  <section>
    <form>
      <input
        type="search"
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </form>

    <style jsx>{`
      section {
        background: #fff;
        padding: 0px 12px 12px 12px;
        box-shadow: 0px 0.5px 0px #cacbcc;
      }

      form {
      }

      input {
        font-size: 24px;
        font-weight: 300;
        width: 100%;
        appearence: none;
        border: none;
        outline: none;
      }

      ::-webkit-input-placeholder {
        text-align: center;
        color: rgba(0, 0, 0, .2);
      }
    `}</style>
  </section>;

export default Search;
