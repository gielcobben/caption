import ReactTestRenderer from "react-test-renderer";
import Content from "./../Content";

jest.mock("react-dropzone", () => 'FakeDropzone');

describe("<Content />", () => {
  it("should show <ListEmpty /> when there is a query but no results", () => {
    const tree = ReactTestRenderer.create(
      <Content searchQuery="test" results={[]} />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("should show <Drop /> when there is no searchQuery and no files dropped", () => {
    const tree = ReactTestRenderer.create(
      <Content searchQuery="" files={[]} />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
