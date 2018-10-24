import * as React from 'react';
import './App.css';

interface State {
  query: string;
  result: Book[];
}
interface BooksInfo {
  '@graph': Array<{ items: Book[] }>;
}
interface Book {
  title: string;
  'dc:creator': string;
}

class App extends React.Component<{}, State> {
  private handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    if (!query) {
      this.setState({ query, result: [] });
      return;
    }
    const url = `https://ci.nii.ac.jp/books/opensearch/search?format=json&q=${query}`;
    const res = await fetch(url);
    if (res.ok) {
      const text = (await res.json()) as BooksInfo;
      if (!text['@graph'] || text['@graph'].length <= 0) {
        this.setState({ query, result: [] });
        return;
      }
      const { items } = text['@graph'][0];
      this.setState({ query, result: items });
      return;
    }
    this.setState({ query, result: [] });
  };
  constructor(props: any) {
    super(props);
    this.state = {
      query: '',
      result: [],
    };
  }
  public render() {
    const { query, result } = this.state;

    return (
      <div>
        <input value={query} onChange={this.handleChange} />
        <br />
        <table>
          {result.map(value => (
            <tr>
              <td>{value.title}</td>
              <td>{value['dc:creator']}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

export default App;
