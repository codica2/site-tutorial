"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var _addEventListeners = Symbol("addEventListeners");

  var _removeEventListeners = Symbol("removeEventListeners");

  var _mouseLeavePopup = Symbol("mouseLeavePopup");

  var _mouseMovePopup = Symbol("mouseMovePopup");

  var _keydownArrowRight = Symbol("keydownArrowRight");

  var _keydownArrowLeft = Symbol("keydownArrowLeft");

  var _outclick = Symbol("outclick");

  var _getCommonHeightdocument = Symbol("getCommonHeightdocument");

  var _updateTextButtons = Symbol("updateTextButtons");

  var _hidePopup = Symbol("hidePopup");

  var _buildDefaultPopup = Symbol("buildDefaultPopup");

  var _buildProgressBar = Symbol("buildProgressBar");

  var _updateProgress = Symbol("updateProgress");

  var _updateDescription = Symbol("updateDescription");

  var _sortBlocks = Symbol("sortBlocks");

  var _getCoords = Symbol("getCoords");

  var _getzIndex = Symbol("getzIndex");

  var _setDefaultzIndex = Symbol("setDefaultzIndex");

  var _startAnimation = Symbol("startAnimation");

  var defaultConfig = {
    time: 1000,
    opacity: 0.7,
    zIndex: 1000,
    padding: 10,
    outclick: false,
    autoStart: false,
    progressBar: null,
    steps: null,
    callback: null
  };

  var SiteTutorial =
  /*#__PURE__*/
  function () {
    function SiteTutorial() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SiteTutorial);

      this.body = document.body;
      this.html = document.documentElement;
      this.config = _objectSpread({}, defaultConfig, config);
      this.blocks = this[_sortBlocks]();
      this.padding = this.config.padding;
      this.offset = 10;
      this.time = this.config.time;
      this.frame_rate = 0.06;
      this.animate;
      this.commonStep = -1;
      this.checkFinish = -1;
      this.isStarted = false;
      this.isHidePopup = false;
      this._isShowPopup = false;
      this.startPositionScroll = this.blocks[0].offsetTop - window.innerHeight / 2;
      if (!config.popup) this.body.appendChild(this[_buildDefaultPopup]());
      this.popup = document.querySelector("#site-tutorial-control-panel");
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", "site-tutroial");
      this.ctx = this.canvas.getContext("2d");
      this.commonHeightDocument = this[_getCommonHeightdocument]();
      this.next = this.next.bind(this);
      this.prev = this.prev.bind(this);
      this.stop = this.stop.bind(this);
      this.start = this.start.bind(this);
      this[_keydownArrowRight] = this[_keydownArrowRight].bind(this);
      this[_keydownArrowLeft] = this[_keydownArrowLeft].bind(this);
      this[_mouseMovePopup] = this[_mouseMovePopup].bind(this);
      this[_mouseLeavePopup] = this[_mouseLeavePopup].bind(this);
      this[_outclick] = this[_outclick].bind(this);
      this.popup.style.position = "absolute";
      this.popup.style.visibility = "hidden";
      this.config.autoStart && this.initialize();
    }

    _createClass(SiteTutorial, [{
      key: "initialize",
      value: function initialize() {
        var canvas = this.canvas,
            popup = this.popup,
            body = this.body,
            config = this.config;
        canvas.width = window.innerWidth + 1;
        canvas.height = this.commonHeightDocument;
        canvas.style.position = "absolute";
        canvas.style.zIndex = config.zIndex;
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.display = "none";
        body.appendChild(canvas);
        this.defaultPopLeft = -this.popup.offsetWidth + "px";
        popup.style.left = this.defaultPopLeft;
        popup.style.zIndex = this.canvas.style.zIndex + 1;
        this.buttonPrev = document.querySelector("#prev-site-tutorial");
        this.buttonNext = document.querySelector("#next-site-tutorial");
        this.buttonStop = document.querySelector("#stop-site-tutorial");
        this.defaultButtonNextText = this.buttonNext.innerHTML;
        this.stepDescription = 0;

        if (config.progressBar) {
          this.stepProgressBar = 0;

          this[_buildProgressBar]();
        }

        this[_getzIndex]();

        this.start();
      }
    }, {
      key: _addEventListeners,
      value: function value() {
        this.buttonNext.addEventListener("click", this.next);
        document.addEventListener("keydown", this[_keydownArrowRight]);
        this.buttonPrev.addEventListener("click", this.prev);
        this.body.addEventListener("keydown", this[_keydownArrowLeft]);
        this.popup.addEventListener("mousemove", this[_mouseMovePopup]);
        this.popup.addEventListener("mouseleave", this[_mouseLeavePopup]);
        this.buttonStop.addEventListener("click", this.stop);
        document.addEventListener("click", this[_outclick]);
      }
    }, {
      key: _removeEventListeners,
      value: function value() {
        this.buttonNext.removeEventListener("click", this.next);
        document.removeEventListener("keydown", this[_keydownArrowRight]);
        this.buttonPrev.removeEventListener("click", this.prev);
        this.body.removeEventListener("keydown", this[_keydownArrowLeft]);
        this.popup.removeEventListener("mousemove", this[_mouseMovePopup]);
        this.popup.removeEventListener("mouseleave", this[_mouseLeavePopup]);
        this.buttonStop.removeEventListener("click", this.stop);
        document.removeEventListener("click", this[_outclick]);
      }
    }, {
      key: _mouseLeavePopup,
      value: function value() {
        if (this.isHidePopup && this._isShowPopup && this.checkFinish === -1) {
          this[_hidePopup]("hide");

          this.isShowPopup = false;
        }
      }
    }, {
      key: _mouseMovePopup,
      value: function value() {
        if (this.isHidePopup && this.checkFinish === -1) {
          this[_hidePopup]("show");

          this.isShowPopup = true;
        }
      }
    }, {
      key: _keydownArrowRight,
      value: function value(e) {
        if (e.key === "ArrowRight") this.next();
      }
    }, {
      key: _keydownArrowLeft,
      value: function value(e) {
        if (e.key === "ArrowLeft") this.prev();
      }
    }, {
      key: "next",
      value: function next() {
        if (this.checkFinish === -1 && this.isStarted && this.commonStep < this.blocks.length - 1) {
          this[_hidePopup]("show");

          this.isShowPopup = true;
          this.stepProgressBar += 2;
          this.stepDescription += 1;
          this.config.progressBar && this[_updateProgress]();

          this[_updateDescription]();

          this[_startAnimation](this.commonStep, "next");

          this.commonStep++;
        }

        this.commonStep === this.blocks.length - 1 && this.stop();

        this[_updateTextButtons]();
      }
    }, {
      key: "prev",
      value: function prev() {
        if (this.checkFinish === -1 && this.isStarted && this.commonStep > 0) {
          this[_hidePopup]("show");

          this.isShowPopup = true;
          this.stepProgressBar -= 2;
          this.stepDescription -= 1;
          this.config.progressBar && this[_updateProgress]();

          this[_updateDescription]();

          this[_startAnimation](this.commonStep, "prev");

          this.commonStep--;
        }

        this[_updateTextButtons]();
      }
    }, {
      key: "start",
      value: function start() {
        this.canvas.style.zIndex = this.config.zIndex;
        this.canvas.style.display = "block";
        this.popup.style.visibility = "visible";
        this.body.style.overflow = "hidden";

        if (!this.isStarted) {
          this[_addEventListeners]();

          this.config.progressBar && this[_updateProgress]();

          this[_updateDescription]();

          this[_updateTextButtons]();

          window.scroll(0, this.startPositionScroll);

          this[_startAnimation](this.commonStep, "next");

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

          this[_removeEventListeners]();

          window.scroll(0, 0);
        }
      }
    }, {
      key: _outclick,
      value: function value(event) {
        var isClickInside = this.popup.contains(event.target);

        if (!isClickInside && this.config.outclick) {
          this.stop();
        }
      }
    }, {
      key: _getCommonHeightdocument,
      value: function value() {
        return Math.max(this.body.scrollHeight, this.body.offsetHeight, this.body.clientHeight, this.html.clientHeight, this.html.offsetHeight);
      }
    }, {
      key: _updateTextButtons,
      value: function value() {
        if (this.commonStep === this.blocks.length - 1) {
          this.buttonNext.innerHTML = "finish";
        } else {
          this.buttonNext.innerHTML = this.defaultButtonNextText;
        }
      }
    }, {
      key: _hidePopup,
      value: function value(status) {
        if (status === "hide") {
          this.popup.style.transitionDuration = "200ms";
          this.popup.style.opacity = 0.2;
        } else {
          this.popup.style.opacity = 1;
        }
      }
    }, {
      key: _buildDefaultPopup,
      value: function value() {
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

        if (this.config.progressBar) {
          var progressLine = document.createElement("div");
          progressLine.setAttribute("id", "progress-site-tutorial");
          progressWrap.appendChild(progressLine);
        }

        if (this.config.progressBar && this.config.progressBar.counter) {
          var progressCounter = document.createElement("p");
          progressCounter.setAttribute("id", "progress-counter-site-tutorial");
          progressWrap.appendChild(progressCounter);
        }

        return controlPanel;
      }
    }, {
      key: _buildProgressBar,
      value: function value() {
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
      key: _updateProgress,
      value: function value() {
        var _this = this;

        this.progress.childNodes.forEach(function (elem, index) {
          if (index % 2 === 0) {
            elem.style.backgroundColor = "";
          }

          if (index <= _this.stepProgressBar && index % 2 === 0) {
            var stepPoint = _this.progress.childNodes[index];
            stepPoint.style.backgroundColor = _this.config.progressBar.color;
          }

          if (_this.progressCounter) {
            _this.progressCounter.innerHTML = _this.stepDescription + 1 + "/" + _this.blocks.length;
          }
        });
      }
    }, {
      key: _updateDescription,
      value: function value() {
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
      key: _sortBlocks,
      value: function value() {
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
      key: _getCoords,
      value: function value(elem) {
        var clientRect = elem.getBoundingClientRect();
        return {
          top: Math.round(clientRect.top + window.scrollY),
          left: Math.round(clientRect.left + window.scrollX)
        };
      }
    }, {
      key: _getzIndex,
      value: function value() {
        var _this2 = this;

        this.defaultzIndexes = [];
        this.blocks.forEach(function (elem) {
          _this2.defaultzIndexes.push(elem.style.zIndex);
        });
      }
    }, {
      key: _setDefaultzIndex,
      value: function value() {
        var _this3 = this;

        this.defaultzIndexes.forEach(function (elem, index) {
          _this3.blocks[index].style.zIndex = elem;
        });
      }
    }, {
      key: _startAnimation,
      value: function value(commonStep, stepTo) {
        var _this4 = this;

        this.buttonNext.disabled = true;
        this.buttonPrev.disabled = true;
        this.buttonStop.disabled = true;

        this[_setDefaultzIndex]();

        var div;
        var step;

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

        var coordsDiv = this[_getCoords](div);

        var divWidth = div.offsetWidth;
        var divHeight = div.offsetHeight;
        var divY = coordsDiv.top;
        var divX = coordsDiv.left;
        var nextDiv = this.blocks[commonStep + step];

        var coordsNextDiv = this[_getCoords](nextDiv);

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
              isFinish: true
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
          var ctx = _this4.ctx,
              canvas = _this4.canvas,
              padding = _this4.padding,
              config = _this4.config;
          canvas.height = _this4[_getCommonHeightdocument]();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "rgba(0,0,0, ".concat(config.opacity || 0.7, ")");
          ctx.fillRect(0, 0, Math.max(0, div.divX - padding), Math.max(0, canvas.height));
          ctx.fillStyle = "rgba(0,0,0, ".concat(config.opacity || 0.7, ")");
          ctx.fillRect(Math.max(0, div.divX - padding < 0 ? 0 : div.divX - padding), 0, Math.max(0, canvas.width), Math.max(0, div.divY - padding));
          ctx.fillStyle = "rgba(0,0,0, ".concat(config.opacity || 0.7, ")");
          ctx.fillRect(Math.max(0, div.divX + div.divWidth + padding), Math.max(0, div.divY - padding), Math.max(0, canvas.width - div.divX - padding), Math.max(0, canvas.height));
          ctx.fillStyle = "rgba(0,0,0, ".concat(config.opacity || 0.7, ")");
          ctx.fillRect(Math.max(0, div.divX - padding), Math.max(0, div.divY + div.divHeight + padding), Math.max(0, div.divWidth + padding * 2), Math.max(0, canvas.height));
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillRect(Math.max(0, div.divX - padding), Math.max(0, div.divY - padding), Math.max(0, div.divWidth + padding * 2), Math.max(0, div.divHeight + padding * 2));
          animatePopup();
        };

        var animatePopup = function animatePopup() {
          var popup = _this4.popup,
              padding = _this4.padding,
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

            if (bottomPos > this[_getCommonHeightdocument]()) {
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
            var call = _this4.config.steps && _this4.config.steps[_this4.stepDescription] && _this4.config.steps[_this4.stepDescription].callback;

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
                return console.error(err);
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

          if (newDiv.isFinish) {
            callbackPromise().finally(function () {
              return stopAnimate();
            });
            clearInterval(_this4.animate);

            if (_this4.isHidePopup) {
              _this4[_hidePopup]("hide");
            }
          }

          draw(newDiv);
        };

        var loop = function loop() {
          if (_this4.commonStep >= 0) {
            commonDraw();
          } else {
            firstDraw();
          }
        };

        this.animate = setInterval(loop, 1 / this.frame_rate);
      }
    }, {
      key: "isShowPopup",
      set: function set(value) {
        this._isShowPopup = value;
      }
    }, {
      key: "_padding",
      set: function set(value) {
        if (this.padding > 15 || this.padding < 0) {
          this.padding = 10;
        }
      }
    }]);

    return SiteTutorial;
  }();
})();