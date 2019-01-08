document.onreadystatechange = function() {
  if (document.readyState == "interactive") {
    const configs = {
      progressBar: {
        color: "#FF3A41",
        counter: true
      },
      steps: {
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
      callback: function(nodeElem, step) {}
    };

    new SiteTutorial(configs);
  }
};
