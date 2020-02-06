import React, { Component } from 'react';
import './App.css';

class Board extends Component {

    constructor() {
      super();
      this.state = {
          movies: [],
          focusedContactKey: '-1',
          messageInput: '',
          searchValue: '',
          yearValue: '',
          searchType: 'all',
          errorMessage: '',
          favorites: [],
      }
    }
  
    focusMovie(key) {

    }

    toggleFav(key, imdbID) { // key to change it in current view, imdbID to make change persistant
        var favorites = this.state.favorites;
        if (favorites.includes(imdbID)) {
            favorites.splice( favorites.indexOf(imdbID), 1 );
        } else {
            favorites.push(imdbID);
        }
        this.setState({favorites: favorites});
        localStorage.setItem('favorites', favorites.join(','));
    }

    renderMovies() {
        if(this.state.movies !== undefined && this.state.movies.length > 0)
            return this.state.movies.map((data, key) => {
                    return (
                        <div className="MovieListItem"
                                key = {key}
                                onClick={() => this.focusMovie(key)}>
                            <img className="MovieImage" src={data.Poster} alt={data.Title + ' poster'}></img>
                            <div className="MovieItemTextContainer">
                                <div className="MovieName">{data.Title}</div>
                                <div className="MovieYear">{data.Year}</div>
                                <div className="MovieFavoriteButton">
                                    {this.state.favorites.includes(data.imdbID) ? <div className="UnFavoriteButton" onClick={()=>{this.toggleFav(key,data.imdbID)}}>UnFavorite</div> : <div className="FavoriteButton" onClick={()=>{this.toggleFav(key,data.imdbID)}}>Favorite</div>}
                                </div>
                            </div>
                        </div>
                    )
            })
        else
            return (
                <div>{this.state.errorMessage}</div>
            )
    }

    render() {
        return (
        <div className="Board">
            <div className="SearchInputContainer">
                <input type="text"
                        name="body"
                        className="SearchInput"
                        placeholder="Search for movies, tv shows"
                        onChange={(text) => {this.setState({searchValue: text.target.value});}}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.searchValue}/>
                <input type="text"
                        name="body"
                        className="YearInput"
                        placeholder="Year"
                        onChange={(text) => {this.setState({yearValue: text.target.value});}}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.yearValue}/>
                <select className="TypeDropdown" onChange={(e) => {this.setState({searchType: e.target.value});}}>
                    <option>All</option>
                    <option>Movie</option>
                    <option>Series</option>
                    <option>Episode</option>
                </select>
                <button className="SearchButton" onClick={() => {this.fetchMovies()}}>Search</button>
            </div>
            <div className="MoviesContainer" style={{overflowY: 'auto'}}>
                <div className="MovieListContainer">{this.renderMovies()}</div>
            </div>
        </div>
        );
    }

    componentDidMount() {
        var persistantFavs = localStorage.getItem('favorites');
        if (persistantFavs !== undefined && persistantFavs !== '')
            this.setState({favorites: persistantFavs.split(',')});
        else
            this.setState({favorites: []});
    }

    fetchMovies() {
        // Where we're fetching data from
        var searchValue = this.state.searchValue;
        var yearValue = this.state.yearValue;
        var type = this.state.searchType;

        var searchKeywords = searchValue.split(' ');
        searchValue = searchKeywords.join('+');

        var url = 'http://www.omdbapi.com/?apikey=498c779a';
        if(searchValue !== undefined && searchValue.length !== 0)
            url += '&s=' + searchValue;
        if(yearValue !== undefined && yearValue.length !== 0 && this.isNumeric(yearValue) && yearValue.length === 4)
            url += '&y=' + yearValue;
        if(type !== '' && type !== undefined && type.toLowerCase() !== 'all')
            url += '&type='+type;

        fetch(url)
          // We get the API response and receive data in JSON format...
          .then(response => response.json())
          // ...then we update the users state
          .then((data) => {
            // console.log("response = " + JSON.stringify(data));
            if(data.Error !== undefined)
                this.setState({errorMessage: data.Error, movies: []});
            else
                this.setState({
                    movies: data.Search,
                    isLoading: false,
                })
        })
          // Catch any errors we hit and update the app
          .catch(error => this.setState({ error, isLoading: false }));
      }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }
  }
  
  export default Board;