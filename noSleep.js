(function (root) {
  const media = {
    WebM: "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
  };

  function addSourceToVideo(element, type, dataURI) {
    var source = document.createElement('source');
    source.src = dataURI;
    source.type = "video/" + type;
    element.appendChild(source);
  }

  class NoSleep {
    constructor() {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement('video');
      this.noSleepVideo.setAttribute("loop", "");

      // Append nosleep video sources
      addSourceToVideo(this.noSleepVideo, "webm", media.WebM);
    }

    enable() {
      this.noSleepVideo.play();
    }

    // Disable NoSleep instance
    disable() {
      this.noSleepVideo.pause();
    }
  }

  root.NoSleep = NoSleep
}(this))