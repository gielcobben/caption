import "./Home.scss";
import { remote } from "electron";
import path from "path";
import OpenSubtitles from "subtitler";
import React, { Component } from "react";
import Promise from "bluebird";
import Storage from "electron-json-storage";
import List from "../components/List";
import Loading from "../components/Loading";
import Dropzone from "../components/Dropzone";
import Settings from "../components/Settings";
import EmptyList from "../components/EmptyList";
import SearchField from "../components/SearchField";
import { CheckFiles, ToBuffer, DownloadSubtitles } from "../scripts/Utility";
import { opensubtitles, addic7ed } from "../sources";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      lang: "eng",
      files: [],
      results: [],
      loading: false,
      dragging: false,
      searching: false,
      searched: false,
      dropzoneText: "Drop an episode or season…"
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.resetList = this.resetList.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.searchForFiles = this.searchForFiles.bind(this);
    this.searchForTitle = this.searchForTitle.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
    this.showNothingFoundDialog = this.showNothingFoundDialog.bind(this);
    this.disableNothingFoundDialog = this.disableNothingFoundDialog.bind(this);
    this.dialogCallback = this.dialogCallback.bind(this);
  }

  setFileStatus(index, status) {
    if (this.state.files.length > 0) {
      this.setState({
        files: [
          ...this.state.files.slice(0, index),
          { ...this.state.files[index], status },
          ...this.state.files.slice(index + 1)
        ]
      });
    }
  }

  dialogCallback(response, checkboxChecked) {
    // If OK is clicked, search in English
    if (response === 0) {
      this.setState(
        {
          lang: "eng"
        },
        () => {
          this.searchForTitle();
        }
      );
    }

    // If checkbox checked, don't show the dialog anymore.
    if (checkboxChecked) {
      this.disableNothingFoundDialog();
    }
  }

  showNothingFoundDialog() {
    const dialog = remote.dialog;
    const options = {
      type: "question",
      buttons: ["OK", "Cancel"],
      message: "No results found, try English?",
      checkboxLabel: "Do not show this message again.",
      detail: `Sorry, we didn’t find any [${this.state.lang}] subtitles matching your file. Would you like to try searching for English subtitles?`
    };

    dialog.showMessageBox(options, this.dialogCallback);
  }

  disableNothingFoundDialog() {
    Storage.set("noting-found-window", false, error => {
      if (error) throw error;
    });
  }

  searchForFiles() {
    const files = this.state.files;

    files.map((file, index) => {
      // Construct multiple sources
      const s1 = opensubtitles.searchFile(file, this.state.lang);
      const s2 = addic7ed.searchFile(file, this.state.lang);

      // The first source who comes with an results
      Promise.any([s1, s2])
        .then(({ subtitles, source, file }) => {
          console.log(subtitles);
          console.log(source);
          console.log(file);

          // Switch source for the right download function
          switch (source) {
            case "addic7ed":
              console.log("Downloading from addic7ed...");
              return addic7ed.downloadFile(subtitles[0], file);
            case "opensubtitles":
              console.log("Downloading from opensubtitles...");
              return opensubtitles.downloadFile(subtitles, file);
            default:
              return new Error("No subtitle downloaded.");
          }
        })
        .then(() => {
          this.setFileStatus(index, "done");
        })
        .catch(error => {
          this.setFileStatus(index, "failed");
          console.log(error);
        });
    });
  }

  searchForTitle(event) {
    // Prevent default form submit
    if (event) {
      event.preventDefault();
    }

    // Only do a search if there's a query
    if (this.state.query) {
      // Enable loading
      this.setState({
        loading: true,
        searching: true,
        searched: true,
        results: []
      });

      // Construct multiple sources
      const s1 = opensubtitles
        .searchQuery(this.state.query, this.state.lang)
        .then(results => {
          this.setState((prevState, props) => ({
            results: [...prevState.results, ...results.subtitles],
            loading: false
          }));
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loading: false
          });
        });

      const s2 = addic7ed
        .searchQuery(this.state.query, this.state.lang)
        .then(results => {
          this.setState((prevState, props) => ({
            results: [...prevState.results, ...results.subtitles],
            loading: false
          }));
        })
        .catch(error => {
          // console.log(error);
          this.setState({
            loading: false
          });
        });

      Promise.all([s1, s2])
        .then(() => {
          this.setState({
            searching: false
          });
        })
        .then(() => {
          Storage.get("noting-found-window", (error, data) => {
            if (error) throw error;

            if (data) {
              if (
                this.state.results.length === 0 &&
                this.state.lang !== "eng"
              ) {
                this.showNothingFoundDialog();
              }
            }
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            searching: false
          });
        });
    }
  }

  onDragEnter(event) {
    this.setState({
      dragging: true
    });
  }

  onDragLeave() {
    if (this.state.dragging) {
      this.setState({
        dragging: false
      });
    }
  }

  onDragOver() {
    if (!this.state.dragging) {
      this.setState({
        dragging: true
      });
    }
  }

  getFilePath(isDirectory, fileDropped) {
    if (isDirectory) {
      return fileDropped.path;
    } else {
      return path.dirname(fileDropped.path);
    }
  }

  onDrop(event) {
    // Prevent Default
    event.preventDefault();

    // Get the dropped files
    const filesDropped = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    // Process dropped path
    const { files, isDirectory } = CheckFiles(filesDropped);

    // If files
    if (files.length > 0) {
      const filePath = this.getFilePath(isDirectory, filesDropped[0]);
      const query = filePath.substr(filePath.lastIndexOf("/") + 1);

      if (this.state.files.length > 0) {
        //Add to current array
        this.setState(
          {
            query: query,
            results: [],
            files: files,
            dragging: false
          },
          () => {
            this.searchForFiles();
          }
        );
      } else {
        // New Array with files
        this.setState(
          {
            query: query,
            results: [],
            files: files,
            dragging: false
          },
          () => {
            this.searchForFiles();
          }
        );
      }
    } else {
      // If the file is too small, do nothing
      this.setState({
        dragging: false
      });
    }
  }

  onLanguageChange(lang) {
    Storage.set("language", lang, error => {
      if (error) throw error;
    });

    this.setState({
      lang
    });

    // Search again
    if (this.state.results.length > 0) {
      this.searchForTitle();
    } else {
      // Set the new loading state and search again
      this.setState(
        {
          files: this.state.files.map(file => {
            return { ...file, status: "loading" };
          })
        },
        () => {
          this.searchForFiles();
        }
      );
    }
  }

  onQueryChange(query) {
    this.setState({
      files: [],
      query: query
    });
  }

  resetList() {
    this.setState({
      files: [],
      query: "",
      results: [],
      loading: false,
      searched: false
    });
  }

  onKeyPress(event) {
    if (event.keyCode === 27) {
      this.resetList();
    }
  }

  componentWillMount() {
    Storage.get("language", (error, lang) => {
      if (Object.keys(lang).length === 0 && lang.constructor === Object) {
        this.setState({
          lang: "eng"
        });
      } else {
        this.setState({
          lang: lang
        });
      }
    });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  render() {
    // Content
    let content;

    // Construct circle icon
    const circle = (
      <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
        <circle cx="12.5" cy="12.5" r="12.5" />
      </svg>
    );

    // If loading is true or if there are results and loading is true
    // (Loading state)
    if (this.state.loading) {
      content = <Loading />;
    } else if (this.state.results.length > 0) {
      // If there are results show the list with results
      // (TextSearch State)
      content = (
        <List
          textSearch={true}
          results={this.state.results}
          resetList={this.resetList}
          onDrop={this.onDrop}
        />
      );
    } else if (this.state.files.length > 0) {
      // If there are files dropped show the list with files
      // (FileSearch state)
      content = (
        <List
          fileSearch={true}
          results={this.state.files}
          resetList={this.resetList}
          onDrop={this.onDrop}
        />
      );
    } else if (this.state.query === "") {
      // If the query is empty show the dropzone
      // (Home state)
      content = (
        <Dropzone
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          dragging={this.state.dragging}
        />
      );
    } else {
      // Everything else, show an empty list
      // (Typing... state)
      content = <EmptyList />;
    }

    // Render
    return (
      <div className="wrapper">
        <SearchField
          resetList={this.resetList}
          submitForm={this.searchForTitle}
          changeQuery={this.onQueryChange}
          defaultValue={this.state.query}
          showReset={!this.state.visibleDropArea}
        />
        <Settings
          query={this.state.query}
          selectedLanguage={this.state.lang}
          changeLanguage={this.onLanguageChange}
          results={this.state.results}
          files={this.state.files}
          resetList={this.resetList}
          searching={this.state.searching}
          searched={this.state.searched}
        />
        <section className={`content-wrapper`}>
          {content}
        </section>
      </div>
    );
  }
}
