/* global AFRAME */
AFRAME.registerComponent('envscore', {
    schema: {
      htmlSrc: {type: 'selector'},
      startOpened: {default: false},
      totalScore: {type: 'int', default: 0}
    },
    init: function () {

      var sceneEl = this.el.sceneEl;
      var messageEl = this.messageEl = document.createElement('div');
      var startOpened = this.data.startOpened;
      var infoButton = this.infoButton = document.createElement('button');

      this.toggleInfoMessage = this.toggleInfoMessage.bind(this);
      this.getDataDetails = this.getDataDetails.bind(this);
  
      messageEl.classList.add('a-score-pop-up');
      messageEl.setAttribute('aframe-injected', '');
  
      var closeButtonEl = this.closeButtonEl = document.createElement('button');
      closeButtonEl.innerHTML = 'X';
      closeButtonEl.classList.add('a-close-button-info');
      closeButtonEl.onclick = this.toggleInfoMessage;
  
      this.createScoresButton(this.toggleInfoMessage);
  
      this.addStyles();
      sceneEl.appendChild(messageEl);
  
      this.messageEl.style.display = startOpened ? '' : 'none';
      this.infoButton.style.display = startOpened ? 'none' : '';

      
    },
  
    update: function () {
      var messageEl = this.messageEl;
      messageEl.innerHTML = this.data.htmlSrc.data;
      messageEl.appendChild(this.closeButtonEl);
      
      var detailsButton = document.querySelector('.detailsButton');
      detailsButton.addEventListener('click', this.getDataDetails);
    },
  
    addStyles: function () {
      var css =
       // '@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);' +

       '@import url(https://kit.fontawesome.com/200bb4af22.js);' +
        '.a-score-pop-up{border-radius: 25px; position: absolute; width: 400px;' +
        'height: 625px; background: rgba(255,255,255,1); border: 0px solid rgba(0,0,0,.75);' +
        'top: 100px; left: 50px; color: rgb(51, 51, 51); padding: 20px 15px 0 15px;' +
        'font-size: 11pt; line-height: 20pt;}' +
  
        '.a-score-pop-up a{border-bottom: 1px solid rgba(53,196,232,.15); color: #1497b8;' +
        'position: relative; text-decoration: none; transition: .05s ease;}' +
          
        '@media only screen and (min-width: 1200px) {' +
        '.a-score-pop-up {font-size: 12pt}}' +
  
        '@media only screen and (max-width: 600px) {' +
        '.a-score-pop-up {left: 20px; right: 20px; bottom: 60px; width: auto}}' +
          
        '@media only screen and (max-height: 600px) {' +
        '.a-score-pop-up {left: 20px; bottom: 20px; height: 450px}'+
        '}' +

  
        '.a-close-button-info{width: 25px; height: 25px; padding: 0;' +
        'top: 15px; right: 15px; position: absolute; color: #404040; background-color: white;'  +
        'font-size: 30px; line-height: 12px; border: none;' +
        'border-radius: 5px; font-weight: medium}' +
  
        '.a-close-button-info:hover{ color:  #080808}' +
        '.a-scores-container {position: absolute; top: 25px; left: 20px; }' +
        
        '.a-env-score-button {background: rgba(0, 0, 0, 0); color: #92d050; min-width: 58px; min-height: 34px; border-radius: 8px; border: 0px solid #92d050; font-size: 30px; padding: 10px; font-weight: bold; cusor: pointer;}'+
        '.a-env-score-button:hover {color: #68a12b;}'+
        '.a-env-score-button:before { content: "\\f4d8"; display: inline-block; font: normal normal normal 14px/1 FontAwesome;  font-size: inherit;  text-rendering: auto; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }'
        ;

      var style = document.createElement('style');
  
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
  
      document.getElementsByTagName('head')[0].appendChild(style);
    },
  
    closeEnvImpactPanel: function () {
      this.messageEl.style.display = 'none';
  },

    toggleInfoMessage: function () {
        var display = this.messageEl.style.display;
        var socScoreButton = document.querySelector('.a-soc-score-pop-up');
        if (display == 'none' && socScoreButton.style.display == '') {
          this.messageEl.style.display = '';
          socScoreButton.style.display = 'none';
        }
        else {
          display = display === 'none' ? '' : 'none';
          this.messageEl.style.display = display;
        }
    },
  
    createScoresButton: function (onClick) {
      
      var wrapper;
  
      // Create elements.
      wrapper = document.createElement('div');
      wrapper.classList.add('a-scores-container');
      this.infoButton = infoButton = document.createElement('button');
      //infoButton.className = 'a-info-message-button';
      infoButton.className = 'a-env-score-button';
      //infoButton.innerText = " 97";
      infoButton.innerText = " " + this.data.totalScore;
      infoButton.setAttribute('title', 'Environmental impact score');
      // Insert elements.
      wrapper.appendChild(infoButton);
      infoButton.addEventListener('click', function (evt) {
        onClick();
        evt.stopPropagation();
      });
      this.el.sceneEl.appendChild(wrapper);
    },

    updateScore: function (id) {

      var score = document.querySelector('.env-score-1');
      var airPollution = document.querySelector('.airPollution');
      var ghg = document.querySelector('.ghg');
      var landUse = document.querySelector('.landUse');
      var waste = document.querySelector('.waste');
      var waterConsumption = document.querySelector('.waterConsumption');
      var waterPollution = document.querySelector('.waterPollution');

      var circle = document.querySelector('circle');
      var radius = circle.r.baseVal.value;
      var circumference = radius * 2 * Math.PI;

      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
      
      var url = "https://serene-headland-54515.herokuapp.com/materials/"
      fetch(url + id)
        .then((resp) => resp.json())
        .then(function(data) {
          this.infoButton.innerHTML = " " + data.environmentScore.total;
          score.innerHTML = data.environmentScore.total;
          airPollution.innerHTML = data.environmentScore.airPollution + " /100";
          ghg.innerHTML = data.environmentScore.ghg + " /100";
          landUse.innerHTML = data.environmentScore.landUse + " /100";
          waste.innerHTML = data.environmentScore.waste + " /100";
          waterConsumption.innerHTML = data.environmentScore.waterConsumption + " /100";
          waterPollution.innerHTML = data.environmentScore.waterPollution + " /100";

          const offset = circumference - data.environmentScore.total / 100 * circumference;
          circle.style.strokeDashoffset = offset;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    getDataDetails: function(){
      
      var detailsButton = document.querySelector('.detailsButton');

      var values = document.querySelectorAll('.E-value');
      var scores = document.querySelectorAll('.E-score');
     
      if (values && values[0].style.display == "none") {
        values.forEach(element => {
          element.style.display = "";
          detailsButton.innerText = "Hide details";
        });
        scores.forEach(element => {
          element.style.display = "none";
          detailsButton.innerText = "Show details";
        });
      }
      else {
        values.forEach(element => {
          element.style.display = "none";
        });
        scores.forEach(element => {
          element.style.display = "";
        });
      }
    

      var airPollution = document.querySelector('.airPollutionValue');
      var ghg = document.querySelector('.ghgValue');
      var landUse = document.querySelector('.landUseValue');
      var waste = document.querySelector('.wasteValue');
      var waterConsumption = document.querySelector('.waterConsumptionValue');
      var waterPollution = document.querySelector('.waterPollutionValue');

      var url = "https://serene-headland-54515.herokuapp.com/materials/"
      fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
          var airPollutionValue = data.material.outside.airPollutionValue + data.material.inside.airPollutionValue + data.material.ornements.airPollutionValue + data.material.handle.airPollutionValue;
          var ghgValue = data.material.outside.ghgValue + data.material.inside.ghgValue + data.material.ornements.ghgValue + data.material.handle.ghgValue;
          var landUseValue = data.material.outside.landUseValue + data.material.inside.landUseValue + data.material.ornements.landUseValue + data.material.handle.landUseValue;
          var wasteValue = data.material.outside.wasteValue + data.material.inside.wasteValue + data.material.ornements.wasteValue + data.material.handle.wasteValue;
          var waterConsumptionValue = data.material.outside.waterConsumptionValue + data.material.inside.waterConsumptionValue + data.material.ornements.waterConsumptionValue + data.material.handle.waterConsumptionValue;
          var waterPollutionValue = data.material.outside.waterPollutionValue + data.material.inside.waterPollutionValue + data.material.ornements.waterPollutionValue + data.material.handle.waterPollutionValue;

          airPollution.innerHTML = airPollutionValue + " Kg of Co2";
          ghg.innerHTML = ghgValue + " Kg";
          landUse.innerHTML = landUseValue + " Km2";
          waste.innerHTML = wasteValue + " Kg";
          waterConsumption.innerHTML = waterConsumptionValue + " m3";
          waterPollution.innerHTML = waterPollutionValue + " m3";
        })
        .catch(function(error) {
          console.log(error);
        });
    }, 
  });
  