import useFormInputText from "../../hooks/useFormInputText";

const CompanySearchBar = ({
  handleSearch,
}: {
  handleSearch: (currQuery: string) => void;
}) => {
  const query = useFormInputText();

  return (
    <form
      className="w-3/4 flex justify-center bg-ecom-search-bg shadow-ecom-search"
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(query.value);
      }}
    >
      <label className="hidden" htmlFor="company-search-bar">
        Company Search Bar
      </label>
      <input
        className="w-full h-12 text-white px-6 text-base bg-transparent outline-none"
        placeholder="Company Name"
        name="company-search-bar"
        id="company-search-bar"
        type="text"
        onChange={query.handleChange}
        value={query.value}
      />
      <button className="w-12 p-3 rounded-full hover:bg-zinc-600" type="submit">
        <svg
          className="fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </button>
    </form>
  );
};

export default CompanySearchBar;
