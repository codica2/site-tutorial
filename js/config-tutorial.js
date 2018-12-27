const div = document.querySelector("#site-tutorial-control-panel");

// improvements

// add arrow
// add close to default popup
// keyboard control
// title and description from attribute
// rename autoPlay to autoStart
// updating initialize after adding block tutorial

const configs = {
  popup: div, //default popup
  zIndex: 1000, // 1000
  time: 1000, // 1500
  padding: 10, // 15
  opacityBackground: 0.7, // 0.7
  outclick: false, // false
  autoPlay: false, // false
  progressBar: {
    color: "#25a76a" //false
  },
  steps: {
    //false
    0: {
      text: "DIV 1",
      callback: function(nodeElem) {}
    }
  },
  callback: function(nodeElem, step) {} // false
};

// return new Promise((resolve, reject) => {
//   let text = nodeElem.innerHTML;
//   let i = 0;
//   const animateText = setInterval(() => {
//     i++;
//     nodeElem.innerHTML = text.substring(0, i);
//     if (i === text.length) {
//       resolve(true);
//       clearInterval(animateText);
//     }
//   }, 40);
// });

new SiteTutorial(configs);
