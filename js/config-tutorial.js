document.onreadystatechange = function() {
  if (document.readyState == "interactive") {
    const configs = {
      popup: null, // default popup
      zIndex: 1000, // 1000
      time: 1000, // 1000
      padding: 10, // 10
      opacityBackground: 0.7, // 0.7
      outclick: false, // false
      autoStart: false, // false
      progressBar: {
        color: "#FF3A41", //false
        counter: true
      },
      steps: {
        // false
        0: {
          title: null,
          text: null,
          callback: function(nodeElem) {
            return new Promise((resolve, reject) => {
              const nodes = nodeElem.childNodes;
              let elems = [];
              let j = 0;
              for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].style) {
                  nodes[i].style.visibility = "hidden";
                  elems.push(nodes[i]);
                }
              }
              const mainInterval = setInterval(() => {
                elems[j].style.visibility = "visible";
                j++;
                if (j === elems.length) {
                  resolve();
                  clearInterval(mainInterval);
                }
              }, 500);
            });
          }
        },
        1: {
          callback: function(nodeElem) {
            nodeElem.style.zIndex = "4000";
          }
        },
        4: {
          callback: function(nodeElem) {
            nodeElem.style.zIndex = "4000";
          }
        }
      },
      callback: function(nodeElem, step) {} // false
    };

    console.log(true);
    new SiteTutorial(configs);
  }
};
