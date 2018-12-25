const div = document.querySelector("#control-panel");

// improvements

// document.querySelectorAll("[data-tutorial-step]");
// background canvas
// outclick
// auto play

const configs = {
  popup: div,
  zIndex: 1000,
  time: 1000,
  padding: 10,
  offset: 10,
  progressBar: true,
  descriptionByStep: {
    0: "Do you want description?",
    1: "Yes!",
    2: "No!",
    3: "Why?"
  },
  callbackByStep: {
    0: function(nodeElem) {
      console.log(nodeElem.innerHTML);
    }
  },
  callback: function(nodeElem, step) {}
};

class SiteTutorial {
  constructor(config) {
    this.config = config;
    this.blocks = document.querySelectorAll(".tutorial");

    this.body = document.body;
    this.html = document.documentElement;

    this.commonHeightDocument = Math.max(
      this.body.scrollHeight,
      this.body.offsetHeight,
      this.html.clientHeight,
      this.html.scrollHeight,
      this.html.offsetHeight
    );

    this.offset = config.offset || 10;
    this.padding = config.padding || 10;
    this.time = config.time || 1500;

    this.frame_rate = 0.06; // 60 FPS

    this.animate;
    this.commonStep = -1;
    this.checkFinish = -1;

    this.isStarted = false;

    this.startPositionScroll =
      this.blocks[0].offsetTop - window.innerHeight / 2;

    this.initialize(config);
  }

  initialize(config) {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "site-tutroial");

    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = this.commonHeightDocument;
    this.canvas.style.position = "absolute";
    this.canvas.style.zIndex = config.zIndex ? config.zIndex : 1000;
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.display = "none";

    this.body.appendChild(this.canvas);

    this.popup = config.popup;

    this.popup.style.position = "absolute";
    this.popup.style.visibility = "hidden";

    this.defaultPopTop =
      this.blocks[0].offsetTop +
      this.blocks[0].offsetHeight +
      this.offset * 2 +
      "px";

    this.defaultPopLeft = -this.popup.offsetWidth + "px";

    this.popup.style.top = this.defaultPopTop;
    this.popup.style.left = this.defaultPopLeft;

    this.popup.style.zIndex = this.canvas.style.zIndex + 1;

    this.prev = document.querySelector("#prev-site-tutorial");
    this.start = document.querySelector("#start-site-tutorial");
    this.next = document.querySelector("#next-site-tutorial");
    this.stop = document.querySelector("#stop-site-tutorial");

    this.stepDescription = 0;

    if (config.progressBar) {
      this.stepProgressBar = 0;
      this.buildProgressBar();
    }

    // button start

    this.start.addEventListener("click", () => {
      this.canvas.style.zIndex = 1000;
      this.canvas.style.display = "block";

      this.popup.style.visibility = "visible";

      document.body.style.overflow = "hidden";
      config.progressBar && this.updateProgress();
      this.updateDescription();

      if (!this.isStarted) {
        window.scroll(0, this.startPositionScroll);
        this.startAnimation(this.commonStep, "next");
        this.isStarted = true;
        this.commonStep++;
      }
    });

    // button stop

    const stop = () => {
      if (this.checkFinish === -1 && this.isStarted) {
        this.popup.style.top = this.defaultPopTop;
        this.popup.style.left = this.defaultPopLeft;

        this.canvas.style.zIndex = -1;
        this.canvas.style.display = "none";
        document.body.style.overflow = "visible";
        this.popup.style.visibility = "hidden";

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isStarted = false;
        this.commonStep = -1;
        this.stepProgressBar = 0;
        this.stepDescription = 0;
      }
    };

    this.stop.addEventListener("click", stop);

    // button next

    this.next.addEventListener("click", () => {
      if (
        this.checkFinish === -1 &&
        this.isStarted &&
        this.commonStep < this.blocks.length - 1
      ) {
        this.stepProgressBar += 2;
        this.stepDescription += 1;

        config.progressBar && this.updateProgress();
        this.updateDescription();
        this.startAnimation(this.commonStep, "next");

        this.commonStep++;
      }
    });

    // button prev

    this.prev.addEventListener("click", () => {
      if (this.checkFinish === -1 && this.isStarted && this.commonStep > 0) {
        this.stepProgressBar -= 2;
        this.stepDescription -= 1;

        config.progressBar && this.updateProgress();
        this.updateDescription();
        this.startAnimation(this.commonStep, "prev");

        this.commonStep--;
      }
    });

    // out click

    document.addEventListener("click", function(event) {
      let isClickInside = config.popup.contains(event.target);

      if (!isClickInside) {
        stop();
      }
    });
  }

  buildProgressBar() {
    this.progress = document.querySelector("#progress-site-tutorial");

    const oneStep = document.createElement("div");
    oneStep.setAttribute("id", "one-step-site-tutorial");

    const line = document.createElement("div");
    line.setAttribute("id", "line-site-tutorial");
    line.cloneNode(true);

    for (let i = 0; i < this.blocks.length; i++) {
      let cloneOneStep = oneStep.cloneNode(true);
      let cloneLine = line.cloneNode(true);
      cloneLine.style.width = 98 / this.blocks.length - 1 + "%";

      this.progress.appendChild(cloneOneStep);
      if (i !== this.blocks.length - 1) this.progress.appendChild(cloneLine);
    }
  }

  updateProgress() {
    this.progress.childNodes.forEach(elem => {
      elem.style.backgroundColor = "";
    });

    this.progress.childNodes.forEach((e, index) => {
      if (index <= this.stepProgressBar && index % 2 === 0) {
        const stepPoint = this.progress.childNodes[index];
        const color = window
          .getComputedStyle(stepPoint)
          .getPropertyValue("border-color");

        stepPoint.style.backgroundColor = color;
      }
    });
  }

  updateDescription() {
    const description = document.querySelector("#desctirption-site-tutorial");
    if (this.config.descriptionByStep[this.stepDescription]) {
      description.innerHTML = this.config.descriptionByStep[
        this.stepDescription
      ];
    } else {
      description.innerHTML = "";
    }
  }

  startAnimation(commonStep, stepTo) {
    this.next.disabled = true;
    this.prev.disabled = true;
    this.stop.disabled = true;

    let div;
    let step;

    if (commonStep === -1) {
      div = this.blocks[0];
    } else {
      div = this.blocks[commonStep];
    }

    if (stepTo === "next") {
      step = 1;
    } else if (stepTo === "prev") {
      step = -1;
    } else {
      step = 1;
    }

    let divWidth = div.offsetWidth;
    let divHeight = div.offsetHeight;
    let divY = div.offsetTop;
    let divX = div.offsetLeft;

    let nextDiv = this.blocks[commonStep + step];

    let nextDivWidth = nextDiv.offsetWidth;
    let nextDivHeight = nextDiv.offsetHeight;
    let nextDivY = nextDiv.offsetTop;
    let nextDivX = nextDiv.offsetLeft;

    this.checkFinish = 0;

    let frame = 0;
    let framePopup = 0;

    let checkFinishPopup = false;

    const delta = (start, finish) => {
      return (finish - start) / this.time / this.frame_rate;
    };

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
        window.pageYOffset + window.innerHeight / 2
      ) {
        window.scroll(0, divY - window.innerHeight / 2 + divHeight / 2);
      } else if (divY !== nextDivY) {
        window.scroll(0, divY - window.innerHeight / 2 + divHeight / 2);
      }

      if (this.checkFinish === 4 && checkFinishPopup) {
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

    const draw = div => {
      const ctx = this.ctx;
      const canvas = this.canvas;
      const padding = this.padding;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // letf
      ctx.fillStyle = `rgba(0,0,0, 0.7)`;
      ctx.fillRect(0, 0, div.divX - padding, canvas.height);

      // top
      ctx.fillStyle = `rgba(0,0,0, 0.7)`;
      ctx.fillRect(div.divX - padding, 0, canvas.width, div.divY - padding);

      // right
      ctx.fillStyle = `rgba(0,0,0, 0.7)`;
      ctx.fillRect(
        div.divX + div.divWidth + padding,
        div.divY - padding,
        canvas.width - div.divX - padding,
        canvas.height
      );

      // bottom
      ctx.fillStyle = `rgba(0,0,0, 0.7)`;
      ctx.fillRect(
        div.divX - padding,
        div.divY + div.divHeight + padding,
        div.divWidth + padding * 2,
        canvas.height
      );

      ctx.fillStyle = `rgba(0,0,0,0)`;
      ctx.fillRect(
        div.divX - padding,
        div.divY - padding,
        div.divWidth + padding * 2,
        div.divHeight + padding * 2
      );

      animatePopup();
    };

    const animatePopup = () => {
      const popup = this.popup;
      const padding = this.padding;
      const commonHeightDocument = this.commonHeightDocument;

      framePopup++;

      const pW = popup.offsetWidth;
      const pH = popup.offsetHeight;
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      const marginOfDiv = 10;
      const style = popup.style;
      const offset = this.offset;

      let y = popup.offsetTop;
      let x = popup.offsetLeft;

      let finishX =
        nextDivX - offset + (nextDivWidth + padding * 2) / 2 - pW / 2;
      let finishY = nextDivY + nextDivHeight + offset * 2;

      const topPos = nextDivY - pH - offset;
      const bottomPos = nextDivY + nextDivHeight + offset * 2 + pH + offset;
      const leftPos = nextDivX - pW - offset * 2 - padding;

      if (finishX - marginOfDiv < 0) {
        setPositionPopup(x, marginOfDiv, y, finishY);
      } else if (finishX + pW > windowW) {
        setPositionPopup(x, windowW - pW - marginOfDiv, y, finishY);
      } else {
        setPositionPopup(x, finishX, y, finishY);
      }

      function setPositionPopup(startX, finishX, startY, finishY) {
        if (
          topPos < nextDivY &&
          bottomPos > windowH + nextDivY &&
          leftPos < 0
        ) {
          finishY = finishY / 2 + pH;
          finishX = nextDivX - pW - offset - padding + -leftPos;
        } else if (topPos < nextDivY && bottomPos > windowH + nextDivY) {
          finishY = finishY / 2 + pH;
          finishX = nextDivX - pW - offset - padding;
        }

        if (nextDivY + nextDivHeight + pH + offset > commonHeightDocument) {
          finishY = nextDivY - pH - offset - padding;
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

    const callback = () => {
      if (this.config.callbackByStep) {
        this.config.callbackByStep[this.commonStep] &&
          this.config.callbackByStep[this.commonStep](nextDiv);
      }

      this.config.callback(nextDiv, this.commonStep);
    };

    const loop = () => {
      if (this.commonStep >= 0) {
        let newDiv = updateDiv(frame);

        if (newDiv.finish) {
          callback();

          this.next.disabled = !(this.commonStep !== this.blocks.length - 1);
          this.prev.disabled = !(this.commonStep !== 0);
          this.stop.disabled = false;

          clearInterval(this.animate);
          this.checkFinish = -1;
        }
        draw(newDiv);
      } else {
        const firstBlock = {
          divWidth,
          divHeight,
          divX,
          divY
        };

        draw(firstBlock);
        clearInterval(this.animate);
        this.checkFinish = -1;
      }
    };

    this.animate = setInterval(loop, 1 / this.frame_rate);
  }
}

new SiteTutorial(configs);
