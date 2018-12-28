const div = document.querySelector("#site-tutorial-control-panel");

// improvements

// add arrow
// title and description from attribute
// updating initialize after adding block tutorial

const configs = {
  popup: div, // default popup
  zIndex: 1000, // 1000
  time: 1000, // 1500
  padding: 10, // 15
  opacityBackground: 0.7, // 0.7
  outclick: false, // false
  autoStart: false, // false
  progressBar: {
    color: "#25a76a" //false
  },
  steps: {
    //false
    0: {
      title: "TITLE",
      text: "DIV 1",
      callback: function(nodeElem) {
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     alert("Text");
        //     resolve();
        //   }, 2000);
        // });
      }
    }
  },
  callback: function(nodeElem, step) {} // false
};

new SiteTutorial(configs);
