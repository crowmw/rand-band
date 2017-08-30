import React, { Component } from 'react'
import axios from 'axios'
import wiki from 'wikijs'
// import thief from 'color-thief'
import './style.css'
import { flickrKey } from '../../config'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      bandName: null,
      albumName: null,
      albumCover: null,
      fetching: false,
      newData: {}
    }

    this._handleSearchClick = this._handleSearchClick.bind(this)
    this.getRandomAlbumTitle = this.getRandomAlbumTitle.bind(this)
    this.getRandomTitle = this.getRandomTitle.bind(this)
  }

  getRandomTitle = () => {
    return wiki()
      .random(1)
      .then(res => {
        if (res[0].includes('(')) {
          return res[0].slice(0, res[0].indexOf('('))
        }
        if (res[0].includes(',')) {
          return res[0].slice(0, res[0].indexOf(','))
        }
        return res
      })
      .catch(err => console.error(err))
  }

  getRandomAlbumTitle = () => {
    return axios.get(`https://talaikis.com/api/quotes/random/`).then(res => {
      let splittedQuote = res.data.quote.split(' ')
      let wordsNumber = Math.floor(Math.random() * 5) + 1

      if (splittedQuote.length <= wordsNumber) {
        splittedQuote = splittedQuote[0].charAt(0).toUpperCase() + splittedQuote.slice(1)
        return splittedQuote.join(' ').replace('.', '')
      } else {
        splittedQuote = splittedQuote.slice(splittedQuote.length - wordsNumber)
        splittedQuote[0] = splittedQuote[0].charAt(0).toUpperCase() + splittedQuote[0].slice(1)
        return splittedQuote.join(' ').replace('.', '')
      }
    })
  }

  getRandomAlbumCover = () => {
    var url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent`
    url += `&format=json`
    url += `&nojsoncallback=1`
    url += `&per_page=20`
    url += `&page=${Math.floor(Math.random() * 100) + 1}`
    url += `&media=photos`
    url += `&license=1,2,3,4,5,6,7`
    url += `&extras=date_taken,date_upload,geo,license,owner_name,tags,url_o,url_l,url_c,url_z,url_n`
    url += `&sort=interestingness-desc`
    url += `&api_key=${flickrKey}`
    url += `&content_type=1`

    return axios.get(url).then(res => {
      let photos = []
      for (let photo of res.data.photos.photo) {
        photo.width_l === photo.height_l && photo.width_l >= 500 && photos.push(photo.url_l)
        photo.width_c === photo.height_c && photo.width_c >= 500 && photos.push(photo.url_c)
        photo.width_n === photo.height_n && photo.width_n >= 500 && photos.push(photo.url_n)
        photo.width_o === photo.height_o && photo.width_o >= 500 && photos.push(photo.url_o)
        photo.width_z === photo.height_z && photo.width_z >= 500 && photos.push(photo.url_z)
      }
      return photos[Math.floor(Math.random() * photos.length)]
    })
  }

  _handleSearchClick() {
    this.setState({ fetching: true })
    this.getRandomTitle()
      .then(res => {
        this.setState(
          {
            newData: { ...this.state.newData, bandName: res }
          },
          () =>
            this.getRandomAlbumTitle().then(res => {
              this.setState(
                {
                  newData: { ...this.state.newData, albumName: res }
                },
                () =>
                  this.getRandomAlbumCover().then(res => {
                    this.setState(
                      {
                        newData: { ...this.state.newData, albumCover: res }
                      },
                      () =>
                        this.setState({
                          bandName: this.state.newData.bandName,
                          albumName: this.state.newData.albumName,
                          albumCover: this.state.newData.albumCover,
                          newData: {},
                          fetching: false
                        })
                    )
                  })
              )
            })
        )
      })
      .catch(err => console.error(err))
  }

  render() {
    let { bandName, albumName, albumCover, fetching } = this.state
    return (
      <div className="container">
        {bandName !== null &&
        albumName !== null &&
        albumCover !== null && (
          <div className="results-container">
            <h2>{bandName}</h2>
            <img src={albumCover} alt="albumCover" />
            <h3>{albumName}</h3>
          </div>
        )}
        <div className="random-button-container">
          <button onClick={() => this._handleSearchClick()}>
            {fetching ? '...' : 'Randomize new band'}
          </button>
        </div>
      </div>
    )
  }
}

export default Search
