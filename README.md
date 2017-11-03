<h1 align="center">
  <img src="https://getcaption.co/CaptionIcon.png" width="160" alt="icon"><br>
  Caption
  <br>
  <br>
</h1>
<br>
<p align="center">  
  <img src="https://getcaption.co/CaptionCover.png" width="840" alt="banner">
  <br>
  <h6 align="center">INTRODUCTION</h6>
  <p align="center">Caption is a great little app that takes the effort out of finding and setting up the right subtitles. It has a simple, uncomplicated design, a drag &amp; drop search feature, automatic downloading and automatic renaming. Caption is completely <strong>open-source</strong> and made with web technology.</p>
 <p align="center"><a href="https://getcaption.co">Download Caption.</a></p>
</p>
<br>

## ⚡️ Contribute
This app is developed by the same people who are using it. If you are one of them (actually... us) and want to make our app even better, you're more than welcome to contribute.

1. Fork this repository to your own GitHub account and then clone it to your local device
2. Install the dependencies: `npm install`
3. Run the app by building the code and watch for changes: `npm start`

<strong>To make sure that your code works in the finished app, you can generate the binary:</strong>

4. `npm run dist`

<br>
<br>

## 📦 Sources
Due to this project's open-source nature, the sources' management was designed to be as easy as possible and seamlessly integrated with other technologies available. Caption currently has 4 subtitles sources. We continuesly add more sources but feel free to add a source of your own.

- [x] OpenSubtitles
- [x] Addi7ed

### How to add a source
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



## 🔑 License

[MIT](https://github.com/gielcobben/Caption/blob/master/LICENSE) © Giel Cobben