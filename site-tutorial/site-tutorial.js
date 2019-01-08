"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SiteTutorial = function () {
  function SiteTutorial() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SiteTutorial);

    this.config = config;
    this.blocks = this.sortBlocks();

    this.body = document.body;
    this.html = document.documentElement;

    this.padding = config.padding > 15 ? 15 : config.padding ? Math.max(0, config.padding) : 10;
    this.offset = 10;
    this.time = config.time || 1000;
    this.frame_rate = 0.06; // 60 FPS

    this.animate;
    this.commonStep = -1;
    this.checkFinish = -1;

    this.isStarted = false;
    this.isHidePopup = false;
    this.isShowPopup = false;

    this.startPositionScroll = this.blocks[0].offsetTop - window.innerHeight / 2;

    if (!config.popup) this.body.appendChild(this.buildDefaultPopup());

    this.popup = document.querySelector("#site-tutorial-control-panel");

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "site-tutroial");
    this.ctx = this.canvas.getContext("2d");

    this.commonHeightDocument = this.getCommonHeightdocument();

    this.defaultzIndexes = [];

    this.handleNext = this.next.bind(this);
    this.handlePrev = this.prev.bind(this);
    this.handleKeydownArrowRight = this.keydownArrowRight.bind(this);
    this.handleKeydownArrowLeft = this.keydownArrowLeft.bind(this);
    this.handleMouseMovePopup = this.mouseMovePopup.bind(this);
    this.handleMoseLeavePopup = this.mouseLeavePopup.bind(this);
    this.handleOutclick = this.outclick.bind(this);
    this.handleStop = this.stop.bind(this);

    this.initialize(config);
  }

  _createClass(SiteTutorial, [{
    key: "initialize",
    value: function initialize(config) {
      var canvas = this.canvas,
          popup = this.popup,
          body = this.body;


      canvas.width = window.innerWidth;
      canvas.height = this.commonHeightDocument;
      canvas.style.position = "absolute";
      canvas.style.zIndex = config.zIndex ? config.zIndex : 1000;
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.display = "none";

      body.appendChild(canvas);

      popup.style.position = "absolute";
      popup.style.visibility = "hidden";

      this.defaultPopLeft = -this.popup.offsetWidth + "px";

      popup.style.left = this.defaultPopLeft;
      popup.style.zIndex = this.canvas.style.zIndex + 1;

      this.buttonPrev = document.querySelector("#prev-site-tutorial");
      this.buttonStart = document.querySelector("#start-site-tutorial");
      this.buttonNext = document.querySelector("#next-site-tutorial");
      this.buttonStop = document.querySelector("#stop-site-tutorial");

      this.defaultButtonNextText = this.next.innerHTML;
      this.stepDescription = 0;

      if (config.progressBar) {
        this.stepProgressBar = 0;
        this.buildProgressBar();
      }

      this.getzIndex();

      // button start
      this.config.autoStart && this.start().bind(this);
      this.buttonStart.addEventListener("click", this.start.bind(this));
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.buttonNext.addEventListener("click", this.handleNext);
      document.addEventListener("keydown", this.handleKeydownArrowRight);

      this.buttonPrev.addEventListener("click", this.handlePrev);
      this.body.addEventListener("keydown", this.handleKeydownArrowLeft);

      this.popup.addEventListener("mousemove", this.handleMouseMovePopup);
      this.popup.addEventListener("mouseleave", this.handleMoseLeavePopup);

      this.buttonStop.addEventListener("click", this.handleStop);

      document.addEventListener("click", this.handleOutclick);
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      this.buttonNext.removeEventListener("click", this.handleNext);
      document.removeEventListener("keydown", this.handleKeydownArrowRight);

      this.buttonPrev.removeEventListener("click", this.handlePrev);
      this.body.removeEventListener("keydown", this.handleKeydownArrowLeft);

      this.popup.removeEventListener("mousemove", this.handleMouseMovePopup);
      this.popup.removeEventListener("mouseleave", this.handleMoseLeavePopup);

      this.buttonStop.removeEventListener("click", this.handleStop);

      document.removeEventListener("click", this.handleOutclick);
    }
  }, {
    key: "mouseLeavePopup",
    value: function mouseLeavePopup() {
      if (this.isHidePopup && this.isShowPopup && this.checkFinish === -1) {
        this.hidePopup("hide");
        this.isShowPopup = false;
      }
    }
  }, {
    key: "mouseMovePopup",
    value: function mouseMovePopup() {
      if (this.isHidePopup && this.checkFinish === -1) {
        this.hidePopup("show");
        this.isShowPopup = true;
      }
    }
  }, {
    key: "keydownArrowRight",
    value: function keydownArrowRight(e) {
      if (e.key === "ArrowRight") this.next();
    }
  }, {
    key: "keydownArrowLeft",
    value: function keydownArrowLeft(e) {
      if (e.key === "ArrowLeft") this.prev();
    }
  }, {
    key: "next",
    value: function next() {
      if (this.checkFinish === -1 && this.isStarted && this.commonStep < this.blocks.length - 1) {
        this.hidePopup("show");
        this.isShowPopup = true;
        this.stepProgressBar += 2;
        this.stepDescription += 1;

        this.config.progressBar && this.updateProgress();
        this.updateDescription();
        this.startAnimation(this.commonStep, "next");

        this.commonStep++;
      }

      this.commonStep === this.blocks.length - 1 && stop();
      this.updateTextButtons();
    }
  }, {
    key: "prev",
    value: function prev() {
      if (this.checkFinish === -1 && this.isStarted && this.commonStep > 0) {
        this.hidePopup("show");
        this.isShowPopup = true;
        this.stepProgressBar -= 2;
        this.stepDescription -= 1;

        this.config.progressBar && this.updateProgress();
        this.updateDescription();
        this.startAnimation(this.commonStep, "prev");

        this.commonStep--;
      }

      this.updateTextButtons();
    }
  }, {
    key: "start",
    value: function start() {
      this.canvas.style.zIndex = this.config.zIndex;
      this.canvas.style.display = "block";
      this.popup.style.visibility = "visible";
      this.body.style.overflow = "hidden";

      if (!this.isStarted) {
        this.addEventListeners();

        this.config.progressBar && this.updateProgress();
        this.updateDescription();
        this.updateTextButtons();

        window.scroll(0, this.startPositionScroll);
        this.startAnimation(this.commonStep, "next");
        this.isStarted = true;
        this.commonStep++;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.checkFinish === -1 && this.isStarted) {
        this.popup.style.top = this.defaultPopTop;
        this.popup.style.left = this.defaultPopLeft;
        this.popup.style.transitionDuration = "";
        this.popup.style.visibility = "hidden";
        this.isHidePopup = false;

        this.canvas.style.zIndex = -1;
        this.canvas.style.display = "none";

        this.body.style.overflow = "visible";

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.isStarted = false;
        this.commonStep = -1;
        this.stepProgressBar = 0;
        this.stepDescription = 0;

        this.removeEventListeners();

        window.scroll(0, 0);
      }
    }
  }, {
    key: "outclick",
    value: function outclick() {
      var isClickInside = this.popup.contains(event.target);

      if (!isClickInside && this.config.outclick) {
        this.stop();
      }
    }
  }, {
    key: "getCommonHeightdocument",
    value: function getCommonHeightdocument() {
      return Math.max(this.body.scrollHeight, this.body.offsetHeight, this.body.clientHeight, this.html.clientHeight, this.html.scrollHeight, this.html.offsetHeight);
    }
  }, {
    key: "updateTextButtons",
    value: function updateTextButtons() {
      if (this.commonStep === this.blocks.length - 1) {
        this.next.innerHTML = "finish";
      } else {
        this.next.innerHTML = this.defaultButtonNextText;
      }
    }
  }, {
    key: "hidePopup",
    value: function hidePopup(status) {
      if (status === "hide") {
        this.popup.style.transitionDuration = "200ms";
        this.popup.style.opacity = 0.2;
      } else {
        this.popup.style.opacity = 1;
      }
    }
  }, {
    key: "buildDefaultPopup",
    value: function buildDefaultPopup() {
      var controlPanel = document.createElement("div");
      controlPanel.setAttribute("id", "site-tutorial-control-panel");

      var description = document.createElement("div");
      description.setAttribute("id", "description");

      var h = document.createElement("h");
      h.setAttribute("id", "title-site-tutorial");

      var p = document.createElement("p");
      p.setAttribute("id", "desctirption-site-tutorial");

      var stop = document.createElement("span");
      stop.setAttribute("id", "stop-site-tutorial");

      var nav = document.createElement("div");
      nav.setAttribute("id", "nav");

      var progressWrap = document.createElement("div");
      progressWrap.setAttribute("id", "progress-wrap");

      var progressLine = document.createElement("div");
      progressLine.setAttribute("id", "progress-site-tutorial");

      var progressCounter = document.createElement("p");
      progressCounter.setAttribute("id", "progress-counter-site-tutorial");

      var groupButtons = document.createElement("div");
      groupButtons.setAttribute("id", "group-buttons");

      var prev = document.createElement("button");
      prev.setAttribute("id", "prev-site-tutorial");
      prev.innerHTML = "back";

      var next = document.createElement("button");
      next.setAttribute("id", "next-site-tutorial");
      next.innerHTML = "next";

      controlPanel.appendChild(description);
      controlPanel.appendChild(nav);
      description.appendChild(h);
      description.appendChild(p);
      description.appendChild(stop);
      nav.appendChild(progressWrap);
      nav.appendChild(groupButtons);
      groupButtons.appendChild(prev);
      groupButtons.appendChild(next);

      if (this.config.progressBar) progressWrap.appendChild(progressLine);

      if (this.config.progressBar.counter) progressWrap.appendChild(progressCounter);

      return controlPanel;
    }
  }, {
    key: "buildProgressBar",
    value: function buildProgressBar() {
      this.progress = document.querySelector("#progress-site-tutorial");
      this.progress.style.width = "100%";
      this.progress.style.display = "flex";
      this.progress.style.alignItems = "center";
      this.progress.style.justifyContent = "center";

      var oneStep = document.createElement("div");
      oneStep.setAttribute("id", "one-step-site-tutorial");
      var line = document.createElement("div");
      line.setAttribute("id", "line-site-tutorial");

      for (var i = 0; i < this.blocks.length; i++) {
        var cloneOneStep = oneStep.cloneNode(true);
        var cloneLine = line.cloneNode(true);

        cloneLine.style.width = 100 / this.blocks.length - 1 + "%";
        cloneLine.style.height = "1px";
        cloneLine.style.backgroundColor = this.config.progressBar.color;

        cloneOneStep.style.border = "solid 1px " + this.config.progressBar.color;
        cloneOneStep.style.minWidth = "7px";
        cloneOneStep.style.minHeight = "7px";
        cloneOneStep.style.borderRadius = "50%";

        this.progress.appendChild(cloneOneStep);

        if (i !== this.blocks.length - 1) this.progress.appendChild(cloneLine);
      }

      if (this.config.progressBar.counter) {
        this.progressCounter = document.getElementById("progress-counter-site-tutorial");

        this.progressCounter.innerHTML = "1/" + (this.blocks.length + 1);
      }
    }
  }, {
    key: "updateProgress",
    value: function updateProgress() {
      var _this = this;

      this.progress.childNodes.forEach(function (elem, index) {
        if (index % 2 === 0) {
          elem.style.backgroundColor = "";
        }

        if (index <= _this.stepProgressBar && index % 2 === 0) {
          var stepPoint = _this.progress.childNodes[index];
          stepPoint.style.backgroundColor = _this.config.progressBar.color;
        }

        if (_this.progressCounter) _this.progressCounter.innerHTML = _this.stepDescription + 1 + "/" + _this.blocks.length;
      });
    }
  }, {
    key: "updateDescription",
    value: function updateDescription() {
      this.isHidePopup = false;
      this.popup.style.transitionDuration = "";

      var description = document.querySelector("#desctirption-site-tutorial");
      var title = document.querySelector("#title-site-tutorial");

      var propTitle = this.config.steps && this.config.steps[this.stepDescription] && this.config.steps[this.stepDescription].title;

      var propText = this.config.steps && this.config.steps[this.stepDescription] && this.config.steps[this.stepDescription].text;

      var attrTitle = this.blocks[this.stepDescription].attributes["tutorial-title"] && this.blocks[this.stepDescription].attributes["tutorial-title"].value;

      var attrDescription = this.blocks[this.stepDescription].attributes["tutorial-text"] && this.blocks[this.stepDescription].attributes["tutorial-text"].value;

      if (propTitle) {
        title.innerHTML = this.config.steps[this.stepDescription].title;
      } else if (attrTitle) {
        title.innerHTML = attrTitle;
      } else {
        title.innerHTML = "";
      }

      if (propText) {
        description.innerHTML = this.config.steps[this.stepDescription].text;
      } else if (attrDescription) {
        description.innerHTML = attrDescription;
      } else {
        description.innerHTML = "";
      }
    }
  }, {
    key: "sortBlocks",
    value: function sortBlocks() {
      var blocks = document.querySelectorAll("[site-tutorial-step]");
      var sortBlocks = [];

      for (var i = 0; i < blocks.length; i++) {
        sortBlocks.push(blocks[i]);
      }

      return sortBlocks.sort(function (a, b) {
        return +a.attributes["site-tutorial-step"].value - +b.attributes["site-tutorial-step"].value;
      });
    }
  }, {
    key: "getCoords",
    value: function getCoords(elem) {
      var clientRect = elem.getBoundingClientRect();

      return {
        top: Math.round(clientRect.top + scrollY),
        left: Math.round(clientRect.left + scrollX)
      };
    }
  }, {
    key: "getzIndex",
    value: function getzIndex() {
      var _this2 = this;

      this.blocks.forEach(function (elem) {
        _this2.defaultzIndexes.push(elem.style.zIndex);
      });
    }
  }, {
    key: "setDefaultzIndex",
    value: function setDefaultzIndex() {
      var _this3 = this;

      this.defaultzIndexes.forEach(function (elem, index) {
        _this3.blocks[index].style.zIndex = elem;
      });
    }
  }, {
    key: "startAnimation",
    value: function startAnimation(commonStep, stepTo) {
      var _this4 = this;

      this.buttonNext.disabled = true;
      this.buttonPrev.disabled = true;
      this.buttonStop.disabled = true;

      this.setDefaultzIndex();

      var div = void 0;
      var step = void 0;

      if (commonStep === -1) {
        div = this.blocks[0];

        this.popup.style.top = this.blocks[0].offsetTop + this.blocks[0].offsetHeight + this.offset * 2 + "px";
      } else {
        div = this.blocks[commonStep];
      }

      if (stepTo === "next") {
        step = 1;
      } else if (stepTo === "prev") {
        step = -1;
      }

      var coordsDiv = this.getCoords(div);

      var divWidth = div.offsetWidth;
      var divHeight = div.offsetHeight;
      var divY = coordsDiv.top;
      var divX = coordsDiv.left;

      var nextDiv = this.blocks[commonStep + step];

      var coordsNextDiv = this.getCoords(nextDiv);

      var nextDivWidth = nextDiv.offsetWidth;
      var nextDivHeight = nextDiv.offsetHeight;
      var nextDivY = coordsNextDiv.top;
      var nextDivX = coordsNextDiv.left;

      this.checkFinish = 0;

      var frame = 0;
      var framePopup = 0;

      var checkFinishPopup = false;

      var delta = function delta(start, finish) {
        return (finish - start) / _this4.time / _this4.frame_rate;
      };

      var updateDiv = function updateDiv() {
        frame++;

        divX = divX + delta(divX, nextDivX) * frame;
        divY = divY + delta(divY, nextDivY) * frame;
        divWidth = divWidth + delta(divWidth, nextDivWidth) * frame;
        divHeight = divHeight + delta(divHeight, nextDivHeight) * frame;

        if (divX === nextDivX && divY === nextDivY && divWidth === nextDivWidth && divHeight === nextDivHeight) {
          _this4.checkFinish = 4;
        }

        // scroll

        if (divY + nextDivHeight / 2 > window.pageYOffset + window.innerHeight / 2 || divY !== nextDivY) {
          window.scroll(0, divY - window.innerHeight / 2 + divHeight / 2);
        }

        if (_this4.checkFinish === 4 && checkFinishPopup) {
          frame = 0;
          return {
            divWidth: nextDivWidth,
            divHeight: nextDivHeight,
            divX: nextDivX,
            divY: nextDivY,
            finish: true
          };
        }

        return {
          divWidth: Math.round(divWidth),
          divHeight: Math.round(divHeight),
          divX: Math.round(divX),
          divY: Math.round(divY)
        };
      };

      var draw = function draw(div) {
        _this4.canvas.height = _this4.getCommonHeightdocument();
        var ctx = _this4.ctx,
            canvas = _this4.canvas,
            padding = _this4.padding,
            config = _this4.config;


        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // letf
        ctx.fillStyle = "rgba(0,0,0, " + (config.opacityBackground || 0.7) + ")";
        ctx.fillRect(0, 0, Math.max(0, div.divX - padding), Math.max(0, canvas.height));

        // top
        ctx.fillStyle = "rgba(0,0,0, " + (config.opacityBackground || 0.7) + ")";
        ctx.fillRect(Math.max(0, div.divX - padding < 0 ? 0 : div.divX - padding), 0, Math.max(0, canvas.width), Math.max(0, div.divY - padding));

        // right
        ctx.fillStyle = "rgba(0,0,0, " + (config.opacityBackground || 0.7) + ")";
        ctx.fillRect(Math.max(0, div.divX + div.divWidth + padding), Math.max(0, div.divY - padding), Math.max(0, canvas.width - div.divX - padding), Math.max(0, canvas.height));

        // bottom
        ctx.fillStyle = "rgba(0,0,0, " + (config.opacityBackground || 0.7) + ")";
        ctx.fillRect(Math.max(0, div.divX - padding), Math.max(0, div.divY + div.divHeight + padding), Math.max(0, div.divWidth + padding * 2), Math.max(0, canvas.height));

        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(Math.max(0, div.divX - padding), Math.max(0, div.divY - padding), Math.max(0, div.divWidth + padding * 2), Math.max(0, div.divHeight + padding * 2));

        animatePopup();
      };

      var animatePopup = function animatePopup() {
        var popup = _this4.popup,
            padding = _this4.padding,
            commonHeightDocument = _this4.commonHeightDocument,
            offset = _this4.offset;


        framePopup++;

        var pW = popup.offsetWidth;
        var pH = popup.offsetHeight;
        var windowW = window.innerWidth;
        var windowH = window.innerHeight;
        var marginOfDiv = 10;
        var style = popup.style;

        var y = popup.offsetTop;
        var x = popup.offsetLeft;

        var finishX = nextDivX - offset + (nextDivWidth + padding * 2) / 2 - pW / 2;
        var finishY = nextDivY + nextDivHeight + offset * 2;

        var topPos = nextDivY - pH - offset;
        var bottomPos = nextDivY + nextDivHeight + offset + padding + pH;
        var leftPos = nextDivX - pW - offset - padding;
        var rightPos = nextDivX + nextDivWidth + pW + offset + padding;
        var finScroll = Math.max(0, Math.floor(nextDivY - window.innerHeight / 2 + nextDivHeight / 2));

        setPositionPopup = setPositionPopup.bind(_this4);

        if (finishX - marginOfDiv < 0) {
          setPositionPopup(x, marginOfDiv, y, finishY);
        } else if (finishX + pW > windowW) {
          setPositionPopup(x, windowW - pW - marginOfDiv, y, finishY);
        } else {
          setPositionPopup(x, finishX, y, finishY);
        }

        function setPositionPopup(startX, finishX, startY, finishY) {
          var centerHeightDiv = nextDivY + nextDivHeight / 2 - pH / 2;

          if (bottomPos > this.getCommonHeightdocument()) {
            finishY = nextDivY - pH - offset - padding;
          } else if (topPos < nextDivY && bottomPos > windowH + finScroll && rightPos < windowW) {
            finishY = centerHeightDiv;
            finishX = nextDivX + nextDivWidth + offset + padding;
          } else if (topPos < nextDivY && bottomPos > windowH + finScroll && leftPos < 0) {
            finishY = centerHeightDiv;
            finishX = nextDivX - pW - padding - leftPos;
            this.isHidePopup = true;
          } else if (topPos < nextDivY && bottomPos > windowH + finScroll) {
            finishY = centerHeightDiv;
            finishX = nextDivX - pW - offset - padding;
          }

          x = x + delta(startX, finishX) * framePopup;
          y = y + delta(startY, finishY) * framePopup;

          if (y === finishY && x === finishX) {
            framePopup = 0;
            checkFinishPopup = true;
          }

          style.left = x + "px";
          style.top = y + "px";
        }
      };

      var callbackPromise = function callbackPromise() {
        var callbackStep = new Promise(function (resolve) {
          var call = _this4.config.steps[_this4.stepDescription] && _this4.config.steps[_this4.stepDescription].callback;

          if (call) {
            Promise.resolve(call(nextDiv)).then(function () {
              return resolve();
            }).catch(function (err) {
              return console.error(err);
            });
          } else {
            resolve();
          }
        });

        var callbackCommon = new Promise(function (resolve) {
          if (_this4.config.callback) {
            Promise.resolve(_this4.config.callback(nextDiv, _this4.commonStep)).then(function () {
              return resolve();
            }).catch(function (err) {
              return console.log(err);
            });
          } else {
            resolve();
          }
        });

        return Promise.all([callbackStep, callbackCommon]);
      };

      var firstDraw = function firstDraw() {
        var firstBlock = {
          divWidth: divWidth,
          divHeight: divHeight,
          divX: divX,
          divY: divY
        };

        draw(firstBlock);
        clearInterval(_this4.animate);
        _this4.checkFinish = -1;
      };

      var stopAnimate = function stopAnimate() {
        _this4.buttonPrev.disabled = !(_this4.commonStep !== 0);
        _this4.buttonStop.disabled = false;
        _this4.buttonNext.disabled = false;

        _this4.checkFinish = -1;
      };

      var commonDraw = function commonDraw() {
        var newDiv = updateDiv(frame);

        if (newDiv.finish) {
          callbackPromise().then(function () {
            stopAnimate();
          }).catch(function () {
            stopAnimate();
          });

          clearInterval(_this4.animate);

          if (_this4.isHidePopup) {
            _this4.hidePopup("hide");
          }
        }
        draw(newDiv);
      };

      var loop = function loop() {
        if (_this4.commonStep >= 0) commonDraw();else firstDraw();
      };

      this.animate = setInterval(loop, 1 / this.frame_rate);
    }
  }]);

  return SiteTutorial;
}();