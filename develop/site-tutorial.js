class SiteTutorial {
  constructor(config = {}) {
    if (document.readyState == "interactive") {
      const defaultConfig = {
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

      this.config = {
        ...defaultConfig,
        ...config
      };

      this.blocks = this.sortBlocks();

      this.body = document.body;
      this.html = document.documentElement;

      this.padding = this.config.padding;

      if (this.padding > 15 || this.padding < 0) {
        this.padding = 10;
      }

      this.offset = 10;
      this.time = this.config.time;
      this.frame_rate = 0.06; // 60 FPS

      this.animate;
      this.commonStep = -1;
      this.checkFinish = -1;

      this.isStarted = false;
      this.isHidePopup = false;
      this._isShowPopup = false;

      this.startPositionScroll =
        this.blocks[0].offsetTop - window.innerHeight / 2;

      if (!config.popup) this.body.appendChild(this.buildDefaultPopup());

      this.popup = document.querySelector("#site-tutorial-control-panel");

      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", "site-tutroial");
      this.ctx = this.canvas.getContext("2d");

      this.commonHeightDocument = this.getCommonHeightdocument();

      this.defaultzIndexes = [];

      this.next = this.next.bind(this);
      this.prev = this.prev.bind(this);
      this.keydownArrowRight = this.keydownArrowRight.bind(this);
      this.keydownArrowLeft = this.keydownArrowLeft.bind(this);
      this.mouseMovePopup = this.mouseMovePopup.bind(this);
      this.mouseLeavePopup = this.mouseLeavePopup.bind(this);
      this.outclick = this.outclick.bind(this);
      this.handleStop = this.stop.bind(this);
      this.start = this.start.bind(this);

      this.initialize();
    }
  }

  set isShowPopup(value) {
    this._isShowPopup = value;
  }

  initialize() {
    const { canvas, popup, body, config } = this;

    canvas.width = window.innerWidth + 1;
    canvas.height = this.commonHeightDocument;
    canvas.style.position = "absolute";
    canvas.style.zIndex = config.zIndex;
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
    this.config.autoStart && this.start();
    this.buttonStart.addEventListener("click", this.start);
  }

  addEventListeners() {
    this.buttonNext.addEventListener("click", this.next);
    document.addEventListener("keydown", this.keydownArrowRight);

    this.buttonPrev.addEventListener("click", this.prev);
    this.body.addEventListener("keydown", this.keydownArrowLeft);

    this.popup.addEventListener("mousemove", this.mouseMovePopup);
    this.popup.addEventListener("mouseleave", this.mouseLeavePopup);

    this.buttonStop.addEventListener("click", this.handleStop);

    document.addEventListener("click", this.outclick);
  }

  removeEventListeners() {
    this.buttonNext.removeEventListener("click", this.next);
    document.removeEventListener("keydown", this.keydownArrowRight);

    this.buttonPrev.removeEventListener("click", this.prev);
    this.body.removeEventListener("keydown", this.keydownArrowLeft);

    this.popup.removeEventListener("mousemove", this.mouseMovePopup);
    this.popup.removeEventListener("mouseleave", this.mouseLeavePopup);

    this.buttonStop.removeEventListener("click", this.handleStop);

    document.removeEventListener("click", this.outclick);
  }

  mouseLeavePopup() {
    if (this.isHidePopup && this._isShowPopup && this.checkFinish === -1) {
      this.hidePopup("hide");
      this.isShowPopup = false;
    }
  }

  mouseMovePopup() {
    if (this.isHidePopup && this.checkFinish === -1) {
      this.hidePopup("show");
      this.isShowPopup = true;
    }
  }

  keydownArrowRight(e) {
    if (e.key === "ArrowRight") this.next();
  }

  keydownArrowLeft(e) {
    if (e.key === "ArrowLeft") this.prev();
  }

  next() {
    if (
      this.checkFinish === -1 &&
      this.isStarted &&
      this.commonStep < this.blocks.length - 1
    ) {
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

  prev() {
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

  start() {
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

  stop() {
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

  outclick() {
    let isClickInside = this.popup.contains(event.target);

    if (!isClickInside && this.config.outclick) {
      this.stop();
    }
  }

  getCommonHeightdocument() {
    return Math.max(
      this.body.scrollHeight,
      this.body.offsetHeight,
      this.body.clientHeight,
      this.html.clientHeight,
      this.html.offsetHeight
    );
  }

  updateTextButtons() {
    if (this.commonStep === this.blocks.length - 1) {
      this.next.innerHTML = "finish";
    } else {
      this.next.innerHTML = this.defaultButtonNextText;
    }
  }

  hidePopup(status) {
    if (status === "hide") {
      this.popup.style.transitionDuration = "200ms";
      this.popup.style.opacity = 0.2;
    } else {
      this.popup.style.opacity = 1;
    }
  }

  buildDefaultPopup() {
    const controlPanel = document.createElement("div");
    controlPanel.setAttribute("id", "site-tutorial-control-panel");

    const description = document.createElement("div");
    description.setAttribute("id", "description");

    const h = document.createElement("h");
    h.setAttribute("id", "title-site-tutorial");

    const p = document.createElement("p");
    p.setAttribute("id", "desctirption-site-tutorial");

    const stop = document.createElement("span");
    stop.setAttribute("id", "stop-site-tutorial");

    const nav = document.createElement("div");
    nav.setAttribute("id", "nav");

    const progressWrap = document.createElement("div");
    progressWrap.setAttribute("id", "progress-wrap");

    const groupButtons = document.createElement("div");
    groupButtons.setAttribute("id", "group-buttons");

    const prev = document.createElement("button");
    prev.setAttribute("id", "prev-site-tutorial");
    prev.innerHTML = "back";

    const next = document.createElement("button");
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
      const progressLine = document.createElement("div");
      progressLine.setAttribute("id", "progress-site-tutorial");

      progressWrap.appendChild(progressLine);
    }

    if (this.config.progressBar.counter) {
      const progressCounter = document.createElement("p");
      progressCounter.setAttribute("id", "progress-counter-site-tutorial");

      progressWrap.appendChild(progressCounter);
    }

    return controlPanel;
  }

  buildProgressBar() {
    this.progress = document.querySelector("#progress-site-tutorial");
    this.progress.style.width = "100%";
    this.progress.style.display = "flex";
    this.progress.style.alignItems = "center";
    this.progress.style.justifyContent = "center";

    const oneStep = document.createElement("div");
    oneStep.setAttribute("id", "one-step-site-tutorial");
    const line = document.createElement("div");
    line.setAttribute("id", "line-site-tutorial");

    for (let i = 0; i < this.blocks.length; i++) {
      let cloneOneStep = oneStep.cloneNode(true);
      let cloneLine = line.cloneNode(true);

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
      this.progressCounter = document.getElementById(
        "progress-counter-site-tutorial"
      );

      this.progressCounter.innerHTML = "1/" + (this.blocks.length + 1);
    }
  }

  updateProgress() {
    this.progress.childNodes.forEach((elem, index) => {
      if (index % 2 === 0) {
        elem.style.backgroundColor = "";
      }

      if (index <= this.stepProgressBar && index % 2 === 0) {
        const stepPoint = this.progress.childNodes[index];
        stepPoint.style.backgroundColor = this.config.progressBar.color;
      }

      if (this.progressCounter) {
        this.progressCounter.innerHTML =
          this.stepDescription + 1 + "/" + this.blocks.length;
      }
    });
  }

  updateDescription() {
    this.isHidePopup = false;
    this.popup.style.transitionDuration = "";

    const description = document.querySelector("#desctirption-site-tutorial");
    const title = document.querySelector("#title-site-tutorial");

    const propTitle =
      this.config.steps &&
      this.config.steps[this.stepDescription] &&
      this.config.steps[this.stepDescription].title;

    const propText =
      this.config.steps &&
      this.config.steps[this.stepDescription] &&
      this.config.steps[this.stepDescription].text;

    const attrTitle =
      this.blocks[this.stepDescription].attributes["tutorial-title"] &&
      this.blocks[this.stepDescription].attributes["tutorial-title"].value;

    const attrDescription =
      this.blocks[this.stepDescription].attributes["tutorial-text"] &&
      this.blocks[this.stepDescription].attributes["tutorial-text"].value;

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

  sortBlocks() {
    const blocks = document.querySelectorAll("[site-tutorial-step]");
    const sortBlocks = [];

    for (let i = 0; i < blocks.length; i++) {
      sortBlocks.push(blocks[i]);
    }

    return sortBlocks.sort(
      (a, b) =>
        +a.attributes["site-tutorial-step"].value -
        +b.attributes["site-tutorial-step"].value
    );
  }

  getCoords(elem) {
    var clientRect = elem.getBoundingClientRect();

    return {
      top: Math.round(clientRect.top + scrollY),
      left: Math.round(clientRect.left + scrollX)
    };
  }

  getzIndex() {
    this.blocks.forEach(elem => {
      this.defaultzIndexes.push(elem.style.zIndex);
    });
  }

  setDefaultzIndex() {
    this.defaultzIndexes.forEach((elem, index) => {
      this.blocks[index].style.zIndex = elem;
    });
  }

  startAnimation(commonStep, stepTo) {
    this.buttonNext.disabled = true;
    this.buttonPrev.disabled = true;
    this.buttonStop.disabled = true;

    this.setDefaultzIndex();

    let div;
    let step;

    if (commonStep === -1) {
      div = this.blocks[0];

      this.popup.style.top =
        this.blocks[0].offsetTop +
        this.blocks[0].offsetHeight +
        this.offset * 2 +
        "px";
    } else {
      div = this.blocks[commonStep];
    }

    if (stepTo === "next") {
      step = 1;
    } else if (stepTo === "prev") {
      step = -1;
    }

    const coordsDiv = this.getCoords(div);

    let divWidth = div.offsetWidth;
    let divHeight = div.offsetHeight;
    let divY = coordsDiv.top;
    let divX = coordsDiv.left;

    let nextDiv = this.blocks[commonStep + step];

    const coordsNextDiv = this.getCoords(nextDiv);

    let nextDivWidth = nextDiv.offsetWidth;
    let nextDivHeight = nextDiv.offsetHeight;
    let nextDivY = coordsNextDiv.top;
    let nextDivX = coordsNextDiv.left;

    this.checkFinish = 0;

    let frame = 0;
    let framePopup = 0;

    let checkFinishPopup = false;

    const delta = (start, finish) =>
      (finish - start) / this.time / this.frame_rate;

    const updateDiv = () => {
      frame++;

      divX = divX + delta(divX, nextDivX) * frame;
      divY = divY + delta(divY, nextDivY) * frame;
      divWidth = divWidth + delta(divWidth, nextDivWidth) * frame;
      divHeight = divHeight + delta(divHeight, nextDivHeight) * frame;

      if (
        divX === nextDivX &&
        divY === nextDivY &&
        divWidth === nextDivWidth &&
        divHeight === nextDivHeight
      ) {
        this.checkFinish = 4;
      }

      // scroll

      if (
        divY + nextDivHeight / 2 >
          window.pageYOffset + window.innerHeight / 2 ||
        divY !== nextDivY
      ) {
        window.scroll(0, divY - window.innerHeight / 2 + divHeight / 2);
      }

      if (this.checkFinish === 4 && checkFinishPopup) {
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

    const draw = div => {
      const { ctx, canvas, padding, config } = this;

      canvas.height = this.getCommonHeightdocument();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // letf rectangle
      ctx.fillStyle = `rgba(0,0,0, ${config.opacity || 0.7})`;
      ctx.fillRect(
        0,
        0,
        Math.max(0, div.divX - padding),
        Math.max(0, canvas.height)
      );

      // top rectangle
      ctx.fillStyle = `rgba(0,0,0, ${config.opacity || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX - padding < 0 ? 0 : div.divX - padding),
        0,
        Math.max(0, canvas.width),
        Math.max(0, div.divY - padding)
      );

      // right rectangle
      ctx.fillStyle = `rgba(0,0,0, ${config.opacity || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX + div.divWidth + padding),
        Math.max(0, div.divY - padding),
        Math.max(0, canvas.width - div.divX - padding),
        Math.max(0, canvas.height)
      );

      // bottom rectangle
      ctx.fillStyle = `rgba(0,0,0, ${config.opacity || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX - padding),
        Math.max(0, div.divY + div.divHeight + padding),
        Math.max(0, div.divWidth + padding * 2),
        Math.max(0, canvas.height)
      );

      // light area
      ctx.fillStyle = `rgba(0,0,0,0)`;
      ctx.fillRect(
        Math.max(0, div.divX - padding),
        Math.max(0, div.divY - padding),
        Math.max(0, div.divWidth + padding * 2),
        Math.max(0, div.divHeight + padding * 2)
      );

      animatePopup();
    };

    const animatePopup = () => {
      const { popup, padding, offset } = this;

      framePopup++;

      const pW = popup.offsetWidth;
      const pH = popup.offsetHeight;
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      const marginOfDiv = 10;
      const style = popup.style;

      let y = popup.offsetTop;
      let x = popup.offsetLeft;

      let finishX =
        nextDivX - offset + (nextDivWidth + padding * 2) / 2 - pW / 2;
      let finishY = nextDivY + nextDivHeight + offset * 2;

      const topPos = nextDivY - pH - offset;
      const bottomPos = nextDivY + nextDivHeight + offset + padding + pH;
      const leftPos = nextDivX - pW - offset - padding;
      const rightPos = nextDivX + nextDivWidth + pW + offset + padding;
      const finScroll = Math.max(
        0,
        Math.floor(nextDivY - window.innerHeight / 2 + nextDivHeight / 2)
      );

      setPositionPopup = setPositionPopup.bind(this);

      if (finishX - marginOfDiv < 0) {
        setPositionPopup(x, marginOfDiv, y, finishY);
      } else if (finishX + pW > windowW) {
        setPositionPopup(x, windowW - pW - marginOfDiv, y, finishY);
      } else {
        setPositionPopup(x, finishX, y, finishY);
      }

      function setPositionPopup(startX, finishX, startY, finishY) {
        let centerHeightDiv = nextDivY + nextDivHeight / 2 - pH / 2;

        if (bottomPos > this.getCommonHeightdocument()) {
          finishY = nextDivY - pH - offset - padding;
        } else if (
          topPos < nextDivY &&
          bottomPos > windowH + finScroll &&
          rightPos < windowW
        ) {
          finishY = centerHeightDiv;
          finishX = nextDivX + nextDivWidth + offset + padding;
        } else if (
          topPos < nextDivY &&
          bottomPos > windowH + finScroll &&
          leftPos < 0
        ) {
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

    const callbackPromise = () => {
      const callbackStep = new Promise(resolve => {
        const call =
          this.config.steps[this.stepDescription] &&
          this.config.steps[this.stepDescription].callback;

        if (call) {
          Promise.resolve(call(nextDiv))
            .then(() => resolve())
            .catch(err => console.error(err));
        } else {
          resolve();
        }
      });

      const callbackCommon = new Promise(resolve => {
        if (this.config.callback) {
          Promise.resolve(this.config.callback(nextDiv, this.commonStep))
            .then(() => resolve())
            .catch(err => console.error(err));
        } else {
          resolve();
        }
      });

      return Promise.all([callbackStep, callbackCommon]);
    };

    const firstDraw = () => {
      const firstBlock = {
        divWidth,
        divHeight,
        divX,
        divY
      };

      draw(firstBlock);
      clearInterval(this.animate);
      this.checkFinish = -1;
    };

    const stopAnimate = () => {
      this.buttonPrev.disabled = !(this.commonStep !== 0);
      this.buttonStop.disabled = false;
      this.buttonNext.disabled = false;

      this.checkFinish = -1;
    };

    const commonDraw = () => {
      let newDiv = updateDiv(frame);

      if (newDiv.isFinish) {
        callbackPromise().finally(() => stopAnimate());

        clearInterval(this.animate);

        if (this.isHidePopup) {
          this.hidePopup("hide");
        }
      }

      draw(newDiv);
    };

    const loop = () => {
      if (this.commonStep >= 0) {
        commonDraw();
      } else {
        firstDraw();
      }
    };

    this.animate = setInterval(loop, 1 / this.frame_rate);
  }
}
