class SiteTutorial {
  constructor(config) {
    this.config = config;
    this.blocks = document.querySelectorAll(".tutorial");

    this.body = document.body;
    this.html = document.documentElement;

    this.padding = config.padding > 15 ? 15 : Math.max(0, config.padding);
    this.offset = 10;
    this.time = config.time || 1500;
    this.frame_rate = 0.06; // 60 FPS

    this.animate;
    this.commonStep = -1;
    this.checkFinish = -1;

    this.isStarted = false;
    this.isHidePopup = false;
    this.isShowPopup = false;

    this.startPositionScroll =
      this.blocks[0].offsetTop - window.innerHeight / 2;

    this.popup = config.popup;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "site-tutroial");
    this.ctx = this.canvas.getContext("2d");

    this.commonHeightDocument =
      Math.max(
        this.body.scrollHeight,
        this.body.offsetHeight,
        this.html.clientHeight,
        this.html.scrollHeight,
        this.html.offsetHeight
      ) - this.popup.clientHeight;

    this.initialize(config);
  }

  initialize(config) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = this.commonHeightDocument;
    this.canvas.style.position = "absolute";
    this.canvas.style.zIndex = config.zIndex ? config.zIndex : 1000;
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.display = "none";

    this.body.appendChild(this.canvas);

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

    this.defaultButtonNextText = this.next.innerHTML;
    this.stepDescription = 0;

    if (config.progressBar) {
      this.stepProgressBar = 0;
      this.buildProgressBar();
    }

    const updateTextButtons = () => {
      if (this.commonStep === this.blocks.length - 1) {
        this.next.innerHTML = "finish";
      } else {
        this.next.innerHTML = this.defaultButtonNextText;
      }
    };

    // button start

    const start = () => {
      this.canvas.style.zIndex = config.zIndex;
      this.canvas.style.display = "block";
      this.popup.style.visibility = "visible";
      this.body.style.overflow = "hidden";

      config.progressBar && this.updateProgress();
      this.updateDescription();
      updateTextButtons();

      if (!this.isStarted) {
        window.scroll(0, this.startPositionScroll);
        this.startAnimation(this.commonStep, "next");
        this.isStarted = true;
        this.commonStep++;
      }
    };

    config.autoPlay && start();

    this.start.addEventListener("click", start);

    // button stop

    const stop = () => {
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

        window.scroll(0, 0);
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

      this.commonStep === this.blocks.length - 1 && stop();
      updateTextButtons();
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

      updateTextButtons();
    });

    // hide popup

    this.popup.addEventListener("mousemove", () => {
      if (this.isHidePopup && this.checkFinish === -1) {
        this.hidePopup("show");
        this.isShowPopup = true;
      }
    });

    this.popup.addEventListener("mouseleave", () => {
      if (this.isHidePopup && this.isShowPopup && this.checkFinish === -1) {
        this.hidePopup("hide");
        this.isShowPopup = false;
      }
    });

    // out click

    document.addEventListener("click", function(event) {
      let isClickInside = config.popup.contains(event.target);

      if (!isClickInside && config.outclick) {
        stop();
      }
    });
  }

  hidePopup(status) {
    if (status === "hide") {
      this.popup.style.transitionDuration = "200ms";
      this.popup.style.opacity = 0.2;
    } else {
      this.popup.style.opacity = 1;
    }
  }

  buildProgressBar() {
    this.progress = document.querySelector("#progress-site-tutorial");

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
      cloneOneStep.style.width = "7px";
      cloneOneStep.style.height = "7px";
      cloneOneStep.style.borderRadius = "50%";

      this.progress.appendChild(cloneOneStep);

      if (i !== this.blocks.length - 1) this.progress.appendChild(cloneLine);
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
    });
  }

  updateDescription() {
    this.isHidePopup = false;
    this.popup.style.transitionDuration = "";

    const description = document.querySelector("#desctirption-site-tutorial");
    if (
      this.config.steps[this.stepDescription] &&
      this.config.steps[this.stepDescription].text
    ) {
      description.innerHTML = this.config.steps[this.stepDescription].text;
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
      const { ctx, canvas, padding, config } = this;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // letf
      ctx.fillStyle = `rgba(0,0,0, ${config.opacityBackground || 0.7})`;
      ctx.fillRect(
        0,
        0,
        Math.max(0, div.divX - padding),
        Math.max(0, canvas.height)
      );

      // top
      ctx.fillStyle = `rgba(0,0,0, ${config.opacityBackground || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX - padding < 0 ? 0 : div.divX - padding),
        0,
        Math.max(0, canvas.width),
        Math.max(0, div.divY - padding)
      );

      // right
      ctx.fillStyle = `rgba(0,0,0, ${config.opacityBackground || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX + div.divWidth + padding),
        Math.max(0, div.divY - padding),
        Math.max(0, canvas.width - div.divX - padding),
        Math.max(0, canvas.height)
      );

      // bottom
      ctx.fillStyle = `rgba(0,0,0, ${config.opacityBackground || 0.7})`;
      ctx.fillRect(
        Math.max(0, div.divX - padding),
        Math.max(0, div.divY + div.divHeight + padding),
        Math.max(0, div.divWidth + padding * 2),
        Math.max(0, canvas.height)
      );

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
      const { popup, padding, commonHeightDocument, offset } = this;

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
      const bottomPos = nextDivY + nextDivHeight + offset + pH;
      const leftPos = nextDivX - pW - offset - padding;
      const rightPos = nextDivX + nextDivWidth + pW + offset + padding;

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

        if (
          topPos < nextDivY &&
          bottomPos > windowH + nextDivY &&
          rightPos < windowW
        ) {
          finishY = centerHeightDiv;
          finishX = nextDivX + nextDivWidth + offset + padding;
        } else if (
          topPos < nextDivY &&
          bottomPos > windowH + nextDivY - pH - offset - padding &&
          leftPos < 0
        ) {
          finishY = centerHeightDiv;
          finishX = nextDivX - pW - padding - leftPos;
          this.isHidePopup = true;
        } else if (topPos < nextDivY && bottomPos > windowH + nextDivY) {
          finishY = centerHeightDiv;
          finishX = nextDivX - pW - offset - padding;
        } else if (
          nextDivY + nextDivHeight + pH + offset >
          commonHeightDocument
        ) {
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
      this.config.steps[this.stepDescription] &&
        this.config.steps[this.stepDescription].callback &&
        this.config.steps[this.stepDescription].callback(nextDiv);

      this.config.callback(nextDiv, this.commonStep);
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

    const commonDraw = () => {
      let newDiv = updateDiv(frame);

      if (newDiv.finish) {
        callback();

        this.prev.disabled = !(this.commonStep !== 0);
        this.stop.disabled = false;
        this.next.disabled = false;

        clearInterval(this.animate);
        this.checkFinish = -1;

        if (this.isHidePopup) {
          this.hidePopup("hide");
        }
      }
      draw(newDiv);
    };

    const loop = () => {
      if (this.commonStep >= 0) commonDraw();
      else firstDraw();
    };

    this.animate = setInterval(loop, 1 / this.frame_rate);
  }
}
