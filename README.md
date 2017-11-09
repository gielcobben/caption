<h1 align="center">
  <img src="https://getcaption.co/CaptionIcon.png" width="64" alt="icon"><br>
  Caption: Start watching
  <br>
  <br>
</h1>
<br>
<p align="center">  
  <img src="https://getcaption.co/CaptionCover.png" width="840" alt="banner">
  <br>
  <h6 align="center">INTRODUCTION</h6>
  <p align="center">Caption takes the effort out of finding and setting up the right subtitles. Simple design, drag & drop search, and automatic downloading & renaming, help you to just start watching. Caption is multi-platform, open-source and made entirely on web technology.</p>
 <p align="center"><a href="https://getcaption.co">Download Caption.</a></p>
 <p align="center"><img src="https://img.shields.io/github/downloads/gielcobben/Caption/total.svg" /></p>
</p>
<br>

## ⚡️ Contribute
Caption is entirely open-source and we've tried to make it as easy as possible for anyone to contribute. If you'd like to help out by adding features, working on bug fixes, or assisting in other parts of development, here's how to get started:

1. Fork this repository to your own GitHub account
2. Clone it to your local device: `git clone git@github.com:gielcobben/caption.git`
3. Install the dependencies: `npm install`
4. Run the app by starting electron, building the code and watch for changes: `npm start`
---
5. Build the actual app for all platforms (Mac, Windows and Linux): `npm run dist`

<br>
<br>

## 📦 Sources
Due to this project's open-source nature, the sources' management was designed to be as easy as possible and seamlessly integrated with other technologies available. Caption currently has 4 subtitles sources. We continuesly add more sources but feel free to add a source of your own.

- [x] OpenSubtitles
- [x] Addi7ed

### Add sources
1. Fork this repository to your own GitHub account and then clone it to your local device
2. Install the dependencies: `npm install`
3. Create a new file with the name of the source: `./main/soures/[yoursource].js`
4. Export at least 1 function: `{textSearch, fileSearch}`
5. Create a transformer with the following output:
```js
return {
  name: STRING,
  download: URL,
  extention: STRING,
  source: STRING,
  size: STRING,
  score: INT
}
```
6. Create a pull request and add Giel Cobben or Vernon de Goede as Reviewer.

<br>
<br>

## 🔑 License

[MIT](https://github.com/gielcobben/Caption/blob/master/LICENSE) © [Giel Cobben](https://twitter.com/gielcobben)