import React from 'react';
import './App.css';
import SongCard from './components/SongCard'
import ArtCard from './components/ArtCard'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      song: "",
      artist: "",
      art: "",
      time: 1
    }
  }

  async getData() {
    const response = await fetch('/spotify/current', { mode: "no-cors"})
    const json = await response.json();
    console.log(json)
    this.setState({ 
      song: json.item.name, 
      artist: json.item.artists[0].name, 
      art: json.item.album.images[1].url, 
      time: (json.item.duration_ms - json.progress_ms)
    })
  }

  componentDidMount() {
    this.getData();
    this.interval = setInterval(() => {
      if(this.state.time <= 1) { 
        this.getData()
      }
      else {
        this.setState({ time: this.state.time - 7 })
      }
    }, 1);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ArtCard art={this.state.art} />
          <SongCard title={this.state.song} artist={this.state.artist} time={this.state.time} />
        </header>
      </div>
    );
  }
}

export default App;
