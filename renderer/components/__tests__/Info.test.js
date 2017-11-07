import ReactTestRenderer from "react-test-renderer";
import Info from "./../Info";

describe("<Info />", () => {
  it("should show an empty state when no results are found", () => {
    const tree = ReactTestRenderer.create(<Info loading={false} results={[]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("should show the total results if any are present", () => {
    const results = [{}, {}];
    const tree = ReactTestRenderer.create(<Info loading={false} results={results} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("should show a loader when there are no results yet", () => {
    const tree = ReactTestRenderer.create(<Info loading results={[]} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
