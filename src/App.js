import React, { Component } from 'react';
import './App.css';

// Part 2 Instructions:
// Based upon the sample page created in the first part, write a React component that renders
// the same content. (Use two API’s to retrieve data and render in two columns.) Please use React
// 16.3. Include appropriate import statements (including a package.json is not necessary). The
// code should be contained in one js/jsx file

const getRndInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const limitRange = getRndInteger(5, 10);

class App extends Component {
  state = {
    loadingJsonPlaceholder: true,
    loadingPokemonDetails: true,
    jsonPlaceholderJSON: [],
    pokemonDetails: []
  };

  async componentDidMount() {
    let pokemonUrls = [];
    try {
      let [jsonPlaceholderJSON] = await Promise.all([
        fetch(
          `https://jsonplaceholder.typicode.com/albums/1/photos?_limit=${limitRange}`
        ).then(response => response.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limitRange}`)
          .then(response => response.json())
          .then(json => {
            json.results.map(({ url }) => pokemonUrls.push(url));
            return json.results;
          })
      ]);

      this.setState(
        {
          jsonPlaceholderJSON
        },
        () => {
          this.setState({
            loadingJsonPlaceholder: false
          });
        }
      );

      let pokemonDetails = [];
      pokemonUrls.map(async url => {
        await Promise.all([
          fetch(url)
            .then(response => response.json())
            .then(details => pokemonDetails.push(details))
            .then(() => {
              this.setState({
                pokemonDetails,
                loadingPokemonDetails: false
              });
            })
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      loadingJsonPlaceholder,
      loadingPokemonDetails,
      jsonPlaceholderJSON,
      pokemonDetails
    } = this.state;

    const renderPlaceholderUI = ({
      albumId,
      id,
      title,
      url,
      thumbnailUrl
    }) => {
      return (
        <div key={id} className="card-container">
          <div className="card-image">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img src={thumbnailUrl} alt={title} />
            </a>
          </div>
          <div className="card-body">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <div className="card-title">{title}</div>
            </a>
            <span>album id: {albumId}</span>
          </div>
        </div>
      );
    };

    const renderPokemonUI = ({
      id,
      name,
      sprites: { front_default },
      height,
      weight,
      types
    }) => {
      return (
        <div key={id} className="card-container">
          <div className="card-title">{name}</div>
          <div className="card-details">
            <div className="card-image">
              <img src={front_default} alt={name} />
            </div>
            <div className="card-body">
              <span>height: {height}</span>
              <br />
              <span>weight: {weight}</span>
              <br />
              <span>
                type:{' '}
                {types.map(({ type: { name } }, i) => (
                  <span key={name}>{(i ? ', ' : '') + name}</span>
                ))}
              </span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="app">
        <div className="app-title">
          <h1>Hello Advanced Digital ReactJS</h1>
        </div>
        <div className="flex-container">
          <div className="flex-wrapper">
            <p>JSON placeholder API response</p>
            <div className="flex-children" id="jsonPlaceholder">
              {loadingJsonPlaceholder
                ? `Loading...`
                : jsonPlaceholderJSON.map(data =>
                    renderPlaceholderUI(data)
                  )}
            </div>
          </div>
          <div className="flex-wrapper">
            <p>Pokemon API response</p>
            <div className="flex-children" id="pokemon">
              {loadingPokemonDetails
                ? `Loading...`
                : pokemonDetails.map(data => renderPokemonUI(data))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
