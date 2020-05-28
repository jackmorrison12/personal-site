var LastFmNode = require("lastfm").LastFmNode
const fs = require("fs")
const download = require("image-downloader")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

var lastfm = new LastFmNode({
  api_key: process.env.GATSBY_LASTFM_API_KEY,
  secret: process.env.GATSBY_LASTFM_SECRET,
  useragent: "jackmorrison/v0.1 Personal Website",
})

var request = lastfm.request("user.getTopTracks", {
  user: "jackmorrison12",
  period: "7day",
  limit: 1,
  handlers: {
    success: function (data) {
      try {
        var jsonString = fs.readFileSync("./src/data/lastfm.json")
        const lastfmdata = JSON.parse(jsonString)
        lastfmdata.topTrack.name = data.toptracks.track[0].name
        lastfmdata.topTrack.artist = data.toptracks.track[0].artist.name
        lastfmdata.topTrack.artistUrl = data.toptracks.track[0].artist.url
        lastfmdata.topTrack.url = data.toptracks.track[0].url
        lastfmdata.topTrack.playCount = data.toptracks.track[0].playcount
        jsonString = JSON.stringify(lastfmdata, null, 2)
        fs.writeFileSync("./src/data/lastfm.json", jsonString)
        console.log("🥇 Top Track Data written")
      } catch (err) {
        console.log(err)
        return
      }
    },
    error: function (error) {
      console.log("Error: " + error.message)
    },
  },
})

var request = lastfm.request("user.getRecentTracks", {
  user: "jackmorrison12",
  period: "7day",
  limit: 1,
  handlers: {
    success: function (data) {
      try {
        var jsonString = fs.readFileSync("./src/data/lastfm.json")
        const lastfmdata = JSON.parse(jsonString)
        lastfmdata.recentTrack.name = data.recenttracks.track[0].name
        lastfmdata.recentTrack.url = data.recenttracks.track[0].url
        lastfmdata.recentTrack.artist =
          data.recenttracks.track[0].artist["#text"]
        jsonString = JSON.stringify(lastfmdata, null, 2)
        fs.writeFileSync("./src/data/lastfm.json", jsonString)
        console.log("🕐 Recent Track Data written")
      } catch (err) {
        console.log(err)
        return
      }
    },
    error: function (error) {
      console.log("Error: " + error.message)
    },
  },
})

var request = lastfm.request("user.getTopArtists", {
  user: "jackmorrison12",
  period: "1month",
  limit: 6,
  handlers: {
    success: function (data) {
      try {
        var jsonString = fs.readFileSync("./src/data/lastfm.json")
        const lastfmdata = JSON.parse(jsonString)
        for (i = 0; i < 6; i++) {
          lastfmdata.topArtists[i].name = data.topartists.artist[i].name
          lastfmdata.topArtists[i].playCount =
            data.topartists.artist[i].playcount
          lastfmdata.topArtists[i].url = data.topartists.artist[i].url
        }
        jsonString = JSON.stringify(lastfmdata, null, 2)
        fs.writeFileSync("./src/data/lastfm.json", jsonString)
        console.log("🧑‍🎤 Top Artist Data written")
      } catch (err) {
        console.log(err)
        return
      }
    },
    error: function (error) {
      console.log("Error: " + error.message)
    },
  },
})

var request = lastfm.request("user.getTopAlbums", {
  user: "jackmorrison12",
  period: "12month",
  limit: 6,
  handlers: {
    success: function (data) {
      try {
        var jsonString = fs.readFileSync("./src/data/lastfm.json")
        const lastfmdata = JSON.parse(jsonString)
        for (i = 0; i < 6; i++) {
          lastfmdata.topAlbums[i].name = data.topalbums.album[i].name
          lastfmdata.topAlbums[i].playCount = data.topalbums.album[i].playcount
          lastfmdata.topAlbums[i].url = data.topalbums.album[i].url
          lastfmdata.topAlbums[i].artist = data.topalbums.album[i].artist.name
          lastfmdata.topAlbums[i].artistUrl = data.topalbums.album[i].artist.url
          lastfmdata.topAlbums[i].imageUrl =
            data.topalbums.album[i].image[3]["#text"]
          const options = {
            url: data.topalbums.album[i].image[3]["#text"],
            dest: "./src/images/lastfm/" + i + ".jpg",
          }

          download
            .image(options)
            .then(({ filename }) => {
              console.log("Saved image to", filename)
            })
            .catch(err => console.error(err))
        }
        jsonString = JSON.stringify(lastfmdata, null, 2)
        fs.writeFileSync("./src/data/lastfm.json", jsonString)
        console.log("💽 Top Album Data written")
      } catch (err) {
        console.log(err)
        return
      }
    },
    error: function (error) {
      console.log("Error: " + error.message)
    },
  },
})
