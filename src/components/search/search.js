import React, { Component } from 'react'
import './style.css'
import GitHubRibbon from 'react-github-fork-ribbon'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { randomize } from '../../actions'

class Search extends Component {
  constructor(props) {
    super(props)

    this._handleSearchClick = this._handleSearchClick.bind(this)
  }

  _handleSearchClick = () => {
    this.props.randomize()
  }

  render() {
    let { band, album, cover, fetching } = this.props
    console.log(band, album, cover, fetching)
    return (
      <div className="container">
        <GitHubRibbon
          position="right"
          color="orange"
          href="https://github.com/crowmw/rand-band"
          target="_blank"
        >
          Checkout GitHub
        </GitHubRibbon>
        {band &&
        album &&
        cover && (
          <div className="results-container">
            <div className="bandName-container">
              <span>Band name</span>
              <h2>{band.name}</h2>
            </div>
            <img src={cover.url} alt="albumCover" />
            <div className="album-name-container">
              <span>Album</span>
              <h3>{album.title}</h3>
            </div>
          </div>
        )}
        <div className="random-button-container">
          <button onClick={() => this._handleSearchClick()}>
            {fetching ? '...' : `Randomize`}
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.fetching,
    band: state.band,
    cover: state.cover,
    album: state.album
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ randomize }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
