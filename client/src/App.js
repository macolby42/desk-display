import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      song: "",
      artist: ""
    }
  }

  // async componentDidMount() {
  //   const response = await fetch('/spotify', { mode: "no-cors"})
  //   const json = await response.json();
  //   console.log(json)
  //   this.setState({ data: json })
  // }

  async getData() {
    const response = await fetch('/spotify/current', { mode: "no-cors"})
    const json = await response.json();
    console.log(json)
    this.setState({ song: json.item.name, artist: json.item.artists[0].name })
  }

  componentDidMount () {
    this.getData()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">"{ this.state.song }"</h1>
          <h1 className="App-title">by { this.state.artist }</h1>
        </header>
      </div>
    );
  }
}

export default App;
