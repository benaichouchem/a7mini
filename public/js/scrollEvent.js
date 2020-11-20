// CountUP status animation handling
/***********************/
//CountUpJS library importing text (Unknow issues encountred when using import statemnt)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// playground: stackblitz.com/edit/countup-typescript
var CountUp = /** @class */ (function () {
    function CountUp(target, endVal, options) {
        var _this = this;
        this.target = target;
        this.endVal = endVal;
        this.options = options;
        this.version = '2.0.4';
        this.defaults = {
            startVal: 0,
            decimalPlaces: 0,
            duration: 2,
            useEasing: true,
            useGrouping: true,
            smartEasingThreshold: 999,
            smartEasingAmount: 333,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
        };
        this.finalEndVal = null; // for smart easing
        this.useEasing = true;
        this.countDown = false;
        this.error = '';
        this.startVal = 0;
        this.paused = true;
        this.count = function (timestamp) {
            if (!_this.startTime) {
                _this.startTime = timestamp;
            }
            var progress = timestamp - _this.startTime;
            _this.remaining = _this.duration - progress;
            // to ease or not to ease
            if (_this.useEasing) {
                if (_this.countDown) {
                    _this.frameVal = _this.startVal - _this.easingFn(progress, 0, _this.startVal - _this.endVal, _this.duration);
                }
                else {
                    _this.frameVal = _this.easingFn(progress, _this.startVal, _this.endVal - _this.startVal, _this.duration);
                }
            }
            else {
                if (_this.countDown) {
                    _this.frameVal = _this.startVal - ((_this.startVal - _this.endVal) * (progress / _this.duration));
                }
                else {
                    _this.frameVal = _this.startVal + (_this.endVal - _this.startVal) * (progress / _this.duration);
                }
            }
            // don't go past endVal since progress can exceed duration in the last frame
            if (_this.countDown) {
                _this.frameVal = (_this.frameVal < _this.endVal) ? _this.endVal : _this.frameVal;
            }
            else {
                _this.frameVal = (_this.frameVal > _this.endVal) ? _this.endVal : _this.frameVal;
            }
            // decimal
            _this.frameVal = Math.round(_this.frameVal * _this.decimalMult) / _this.decimalMult;
            // format and print value
            _this.printValue(_this.frameVal);
            // whether to continue
            if (progress < _this.duration) {
                _this.rAF = requestAnimationFrame(_this.count);
            }
            else if (_this.finalEndVal !== null) {
                // smart easing
                _this.update(_this.finalEndVal);
            }
            else {
                if (_this.callback) {
                    _this.callback();
                }
            }
        };
        // default format and easing functions
        this.formatNumber = function (num) {
            var neg = (num < 0) ? '-' : '';
            var result, x, x1, x2, x3;
            result = Math.abs(num).toFixed(_this.options.decimalPlaces);
            result += '';
            x = result.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? _this.options.decimal + x[1] : '';
            if (_this.options.useGrouping) {
                x3 = '';
                for (var i = 0, len = x1.length; i < len; ++i) {
                    if (i !== 0 && (i % 3) === 0) {
                        x3 = _this.options.separator + x3;
                    }
                    x3 = x1[len - i - 1] + x3;
                }
                x1 = x3;
            }
            // optional numeral substitution
            if (_this.options.numerals && _this.options.numerals.length) {
                x1 = x1.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
                x2 = x2.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
            }
            return neg + _this.options.prefix + x1 + x2 + _this.options.suffix;
        };
        this.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };
        this.options = __assign({}, this.defaults, options);
        this.formattingFn = (this.options.formattingFn) ?
            this.options.formattingFn : this.formatNumber;
        this.easingFn = (this.options.easingFn) ?
            this.options.easingFn : this.easeOutExpo;
        this.startVal = this.validateValue(this.options.startVal);
        this.frameVal = this.startVal;
        this.endVal = this.validateValue(endVal);
        this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
        this.decimalMult = Math.pow(10, this.options.decimalPlaces);
        this.resetDuration();
        this.options.separator = String(this.options.separator);
        this.useEasing = this.options.useEasing;
        if (this.options.separator === '') {
            this.options.useGrouping = false;
        }
        this.el = (typeof target === 'string') ? document.getElementById(target) : target;
        if (this.el) {
            this.printValue(this.startVal);
        }
        else {
            this.error = '[CountUp] target is null or undefined';
        }
    }
    // determines where easing starts and whether to count down or up
    CountUp.prototype.determineDirectionAndSmartEasing = function () {
        var end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
        this.countDown = (this.startVal > end);
        var animateAmount = end - this.startVal;
        if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
            this.finalEndVal = end;
            var up = (this.countDown) ? 1 : -1;
            this.endVal = end + (up * this.options.smartEasingAmount);
            this.duration = this.duration / 2;
        }
        else {
            this.endVal = end;
            this.finalEndVal = null;
        }
        if (this.finalEndVal) {
            this.useEasing = false;
        }
        else {
            this.useEasing = this.options.useEasing;
        }
    };
    // start animation
    CountUp.prototype.start = function (callback) {
        if (this.error) {
            return;
        }
        this.callback = callback;
        if (this.duration > 0) {
            this.determineDirectionAndSmartEasing();
            this.paused = false;
            this.rAF = requestAnimationFrame(this.count);
        }
        else {
            this.printValue(this.endVal);
        }
    };
    // pause/resume animation
    CountUp.prototype.pauseResume = function () {
        if (!this.paused) {
            cancelAnimationFrame(this.rAF);
        }
        else {
            this.startTime = null;
            this.duration = this.remaining;
            this.startVal = this.frameVal;
            this.determineDirectionAndSmartEasing();
            this.rAF = requestAnimationFrame(this.count);
        }
        this.paused = !this.paused;
    };
    // reset to startVal so animation can be run again
    CountUp.prototype.reset = function () {
        cancelAnimationFrame(this.rAF);
        this.paused = true;
        this.resetDuration();
        this.startVal = this.validateValue(this.options.startVal);
        this.frameVal = this.startVal;
        this.printValue(this.startVal);
    };
    // pass a new endVal and start animation
    CountUp.prototype.update = function (newEndVal) {
        cancelAnimationFrame(this.rAF);
        this.startTime = null;
        this.endVal = this.validateValue(newEndVal);
        if (this.endVal === this.frameVal) {
            return;
        }
        this.startVal = this.frameVal;
        if (!this.finalEndVal) {
            this.resetDuration();
        }
        this.determineDirectionAndSmartEasing();
        this.rAF = requestAnimationFrame(this.count);
    };
    CountUp.prototype.printValue = function (val) {
        var result = this.formattingFn(val);
        if (this.el.tagName === 'INPUT') {
            var input = this.el;
            input.value = result;
        }
        else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
            this.el.textContent = result;
        }
        else {
            this.el.innerHTML = result;
        }
    };
    CountUp.prototype.ensureNumber = function (n) {
        return (typeof n === 'number' && !isNaN(n));
    };
    CountUp.prototype.validateValue = function (value) {
        var newValue = Number(value);
        if (!this.ensureNumber(newValue)) {
            this.error = "[CountUp] invalid start or end value: " + value;
            return null;
        }
        else {
            return newValue;
        }
    };
    CountUp.prototype.resetDuration = function () {
        this.startTime = null;
        this.duration = Number(this.options.duration) * 1000;
        this.remaining = this.duration;
    };
    return CountUp;
}());
/*CountUp JS import END*/

var statusNumbers = document.getElementsByClassName("dz-status");
var statusNumbersArray = [].slice.call(statusNumbers);
var worldStatusNumbers = document.getElementsByClassName("world-status");
var worldStatusNumbersArray = [].slice.call(worldStatusNumbers);

initilizeStatusNumbers(statusNumbersArray, worldStatusNumbersArray);

var dzStatusAnimate = true;
var worldStatusAnimate = true;


/*****************************************
 * **************************************
 */
/*Symptoms Section Scrollevent handling */
var symptomsImages = document.getElementsByClassName("symptoms-img");
var symptomsImagesArray = [].slice.call(symptomsImages);

var symptomsContent = [{
    title: "Les premiers jours :",
    paragraph: "La plupart ont de la fièvre. Le virus peut également provoquer des douleurs musculaires, de la fatigue, des  étourdissements et même de la diarrhée. La plupart montrent des signes d’amélioration après 6 à 7 jours.",
}, {
    title: "Aux premiers stades de la maladie:",
    paragraph: "Les symptômes courants seront les maux de tête, la toux sèche et le nez qui coule. Finalement, si la maladie s’aggrave, le patient peut avoir une toux grasse ou même une toux sanglante.",
}, {
    title: "Complications :",
    paragraph: "Une respiration difficile et / ou des douleurs thoraciques. Une insuffisance pulmonaire aiguë ou un essoufflement nécessitant un apport d’oxygène peut survenir dans les pires cas. Les symptômes surviennent généralement vers le cinquième jour de la maladie.",
}, {
    title: "Dans certains cas :",
    paragraph: "Le coronavirus entraîne une insuffisance rénale. Les symptômes comprennent des visites fréquentes aux toilettes, un gonflement des jambes et sous les yeux, une pression artérielle élevée et / ou une fatigue et une faiblesse."
}
];

var symptomsContentArabic = [{
    title: ":في الأيام الأولى",
    paragraph: "يعاني معظم المرضى من الحمى. يمكن للفيروس أيضا أن يسبب آلام في العضلات ، والتعب ، والدوخة وحتى الإسهال. يظهر على معظم المرضى علامات تحسن بعد 6 إلى 7 أيام.",
}, {
    title:  ":المراحل الأولى للمرض",
    paragraph: "الأعراض الأكثر شيوعا هي : آلام الرّأس، السّعال الجاف، سيلان الأنف، و في حالة تطوّر المرض يمكن أن يتعرّض المريض لسعال ٍ مصحوبا بالبلغم أو حتى بالدم.",
}, {
    title: ":المضاعفات",
    paragraph: "صعوبة في التنفّس مع / أو آلام في الصدر،و في الحالات الأكثر سوءا يظهر المريض فشلا رئويا حادّا أو ضيقا في التّنفس و الذي يحتاج إلى العلاج  بالأكسجين. هذه الأعراض تظهر غالباً في اليوم الخامس للمرض .",
}, {
    title: ":في بعض الحالات",
    paragraph: "قد يسبب فيروس كورونا الفشل الكلوي وتشمل الأعراض أيضا كثرة الحاجة للذهاب الى المرحاض، وانتفاخ الأرجل و تحت العيون، ضغط الدم العالي مع / أو التعب و الوهن ."
}
];


function changeSymptomsContent(e) {
    var arr = [].slice.call(symptomsImages);

    mobileTitle = document.getElementsByClassName("symptoms-title")[0];
    mobileParagraph = document.getElementsByClassName("symptoms-paragraph")[0];
    mobileTitleArabic = document.getElementsByClassName("symptoms-title-arabic")[0];
    mobileParagraphArabic = document.getElementsByClassName("symptoms-paragraph-arabic")[0];
    desktopTitle = document.getElementsByClassName("symptoms-title")[1];
    desktopTitleArabic = document.getElementsByClassName("symptoms-title-arabic")[1];
    desktopParagraph = document.getElementsByClassName("symptoms-paragraph")[1];
    desktopParagraphArabic = document.getElementsByClassName("symptoms-paragraph-arabic")[1];

    mobileTitle.innerHTML = symptomsContent[arr.indexOf(e)].title;
    mobileTitleArabic.innerHTML = symptomsContentArabic[arr.indexOf(e)].title;
    mobileParagraph.innerHTML = symptomsContent[arr.indexOf(e)].paragraph;
    mobileParagraphArabic.innerHTML = symptomsContentArabic[arr.indexOf(e)].paragraph;
    desktopTitle.innerHTML = symptomsContent[arr.indexOf(e)].title;
    desktopTitleArabic.innerHTML = symptomsContentArabic[arr.indexOf(e)].title;
    desktopParagraph.innerHTML = symptomsContent[arr.indexOf(e)].paragraph;
    desktopParagraphArabic.innerHTML = symptomsContentArabic[arr.indexOf(e)].paragraph;

    // Showing Button, or not
    var btn= document.getElementById("symptoms-test-btn");
    var btn2= document.getElementById("symptoms-test-btn-2");

    if (arr.indexOf(e) === 3) {
        // btn.style.display = "block";
        btn.style.width = "auto";
        btn.style.height = "auto";
        btn.style.padding = "8px 25px";
        setTimeout(1000);
        btn.style.opacity = "1";

        btn2.style.width = "auto";
        btn2.style.height = "auto";
        btn2.style.padding = "8px 25px";
        setTimeout(1000);
        btn2.style.opacity = "1";
    } else {
        btn.style.opacity = 0;
        btn.style.width = "0";
        btn.style.height = "0";
        btn.style.padding = "0  ";

        btn2.style.opacity = 0;
        btn2.style.width = "0";
        btn2.style.height = "0";
        btn2.style.padding = "0  ";
    }

}



/***************************************/
var statusSection = document.getElementById("status");
var worldStatusSection = document.getElementById("world-status");



window.onscroll = () => {
    symptomsImagesArray.forEach(image => {
        if (image.getBoundingClientRect().top <= window.outerHeight/2 && 0 <= image.getBoundingClientRect().top) {
            image.style.opacity = 1;
                changeSymptomsContent(image);
        } else {
            image.style.opacity = 0;
            if (image.id === "symptoms-img-4" && (image.getBoundingClientRect().bottom <= window.outerHeight / 2 || image.getBoundingClientRect().top <= 0)) {
                image.style.opacity = 1;
            }
        }
        // if (image.getBoundingClientRect().bottom <= window.outerHeight/2) {
        //     changeAuthorised = true;
        //     image.style.opacity = 0;
        // }
    });

    // Activiating status numbers animation
    if (statusSection.getBoundingClientRect().top <= window.outerHeight) {
        if (dzStatusAnimate) {
            const easingFn = function (t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (tc + -3 * ts + 3 * t);
            };
            const options = {
                separator: ',',
                duration: 5,
                easingFn,
            };
            statusNumbersArray.forEach(statusNumber => {
                console.log("debug");
                let demo = new CountUp(statusNumber, statusNumber.innerHTML, options);
                if (!demo.error) {
                    demo.start();
                } else {
                    console.error(demo.error);
                }
            });

            dzStatusAnimate = false;
        }
    }
    if (worldStatusSection.getBoundingClientRect().top <= window.outerHeight) {
        if (worldStatusAnimate) {
            const easingFn = function (t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (tc + -3 * ts + 3 * t);
            };
            const options = {
                separator: ',',
                duration: 5,
                easingFn,
            };
            worldStatusNumbersArray.forEach(statusNumber => {
               let demo = new CountUp(statusNumber, statusNumber.innerHTML, options);
                if (!demo.error) {
                    demo.start();
                } else {
                    console.error(demo.error);
                }
            });

            worldStatusAnimate = false;
        }
    }
};



