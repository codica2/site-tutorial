const div = document.querySelector("#control-panel");

// improvements

// document.querySelectorAll("[data-tutorial-step]");
// add default popup
// add arrow

// rewrite callback and steps
// bug with padding and offset
// auto play

const configs = {
  popup: div,
  zIndex: 1000,
  time: 1000,
  padding: 10,
  opacityBackground: 0.7,
  outclick: false,
  autoPlay: false,
  progressBar: {
    color: "#25a76a"
  },
  steps: {
    0: {
      text: "DIV 1",
      callback: function(nodeElem) {
        let text = nodeElem.innerHTML;
        let i = 0;

        const animateText = setInterval(() => {
          i++;
          nodeElem.innerHTML = text.substring(0, i);

          if (i === text.length) {
            clearInterval(animateText);
          }
        }, 40);
      }
    }
  },
  callback: function(nodeElem, step) {}
};

new SiteTutorial(configs);
