
/* global AFRAME, THREE */
AFRAME.registerComponent('modelviewer', {
  schema: {
    gltfModel: {default: ''},
    ScoreHtml:  {type: 'selector'},
    title: {default: ''},
    uploadUIEnabled: {default: true},
  },
  init: function () {
    var el = this.el;

    el.setAttribute('renderer', {colorManagement: true});
    el.setAttribute('cursor', {rayOrigin: 'mouse', fuse: false});
    el.setAttribute('webxr', {optionalFeatures: 'hit-test, local-floor'});
    el.setAttribute('raycaster', {objects: '.raycastable'});

    this.onModelLoaded = this.onModelLoaded.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);

    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.submitURLButtonClicked = this.submitURLButtonClicked.bind(this);

    this.onThumbstickMoved = this.onThumbstickMoved.bind(this);

    this.onEnterVR = this.onEnterVR.bind(this);
    this.onExitVR = this.onExitVR.bind(this);

    this.onMouseDownLaserHitPanel = this.onMouseDownLaserHitPanel.bind(this);
    this.onMouseUpLaserHitPanel = this.onMouseUpLaserHitPanel.bind(this);

    this.onOrientationChange = this.onOrientationChange.bind(this);

    this.initCameraRig();
    this.initEntities();
    this.initBackground();

    if (this.data.uploadUIEnabled) { this.initUploadInput(); }

    // Disable context menu on canvas when pressing mouse right button;
    this.el.sceneEl.canvas.oncontextmenu = function (evt) { evt.preventDefault(); };

    window.addEventListener('orientationchange', this.onOrientationChange);

    // VR controls.
    this.laserHitPanelEl.addEventListener('mousedown', this.onMouseDownLaserHitPanel);
    this.laserHitPanelEl.addEventListener('mouseup', this.onMouseUpLaserHitPanel);

    this.leftHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
    this.rightHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);

    // Mouse 2D controls.
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('wheel', this.onMouseWheel);

    // Mobile 2D controls.
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('touchmove', this.onTouchMove);

    this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
    this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);

    this.modelEl.addEventListener('model-loaded', this.onModelLoaded);

  },

  initUploadInput: function () {
    
    // Function that chage the material of the bag
    // part : Outside, Ornements, Hance1 
    // id : id of the material in the Database
    // texture : path of the image texture
    let changeMaterial = (part, id, texture) => {
      
      var envscore = document.querySelector('[envscore]').components.envscore;
      var socscore = document.querySelector('[socscore]').components.socscore;
      
      envscore.updateScore(id);
      socscore.updateScore(id);
      
      this.modelEl.object3D.traverse(function(object3D){
        var target;
        
        if (object3D.name == part){
          object3D.traverse(function(object3D){
            var mat = object3D.material
            if (mat) {
              const loader = new THREE.TextureLoader();      
              object3D.material.map = loader.load(texture);
            }
          })
        }
      })
    }

    changeMaterial("Outside", 1, "images/Outside/Texture_1_baseColor.jpeg");
    changeMaterial("Ornements", 9,"images/Ornements/gold.jpg");
    changeMaterial("Hance1", 13, "images/Outside/Texture_1_baseColor.jpeg");
    
    var scoreContainer = this.scoreContainer = document.createElement('div');
    scoreContainer.setAttribute('aframe-injected', '');
    
    var uploadContainerEl = this.uploadContainerEl = document.createElement('div');

    
    //OUTSIDE
    var outside = this.outside = document.createElement('div');
    var outisdeBeige = this.outisdeBeige = document.createElement('button');
    var outisdeBlack = this.outisdeBlack = document.createElement('button');
    var outisdeBrown = this.outisdeBrown = document.createElement('button');

    //Ornements    
    var ornements = this.ornements = document.createElement('div');
    var ornementsBeige = this.ornementsBeige = document.createElement('button');
    var ornementsBlack = this.ornementsBlack = document.createElement('button');
    var ornementsBrown = this.ornementsBrown = document.createElement('button');

    //Handle   
    var handle = this.handle = document.createElement('div');
    var handle1 = this.handle1 = document.createElement('button');
    var handle2 = this.handle2 = document.createElement('button');
    var handle3 = this.handle3 = document.createElement('button');
    
    
    var editButtonContainer = this.editButtonContainer = document.createElement('div');
    var editButton = this.editButton = document.createElement('button');
    var editContainer = this.editContainer = document.createElement('div');
    var editTitle = this.editTitle = document.createElement('div');
    var editCloseButton = this.editCloseButton = document.createElement('button');

    var editOutsideContainer = this.editOutsideContainer = document.createElement('div');
    var editOrnementsContainer = this.editOrnementsContainer = document.createElement('div'); 
    var editHandleContainer = this.editHandleContainer = document.createElement('div');    

    var style = document.createElement('style');
    var css =
      '@import url(https://kit.fontawesome.com/200bb4af22.js);' +
      '.a-score  {box-sizing: border-box; display: inline-block; height: 34px; margin: 20px; width: 100%;' +
      'position: absolute; color: white; background-color: red;' +
      'font-size: 12px; line-height: 12px; border: none;' +
      'border-radius: 5px}' +

      '.a-upload-model  {box-sizing: border-box; height: 34px; padding: 0; width: 70%;' +
      'top: 15%; bottom: 15%; right: 0; position: absolute; color: white;' +
      'font-size: 12px; line-height: 12px; border: none;' +
      'border-radius: 5px}' +
      '.a-text-color-change {display: block; font-size: x-large; margin-right: 10px; padding-left: 30px; color: white;}' +
      '.a-upload-model.hidden {display: none}' +
      '.a-button-outside-beige {cursor: pointer; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/Texture_1_baseColor.jpeg"); margin-right: 15px;}' +
      '.a-button-outside-black {cursor: pointer;  font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/full-black2.jpg");  margin-right: 15px;}' +
      '.a-button-outside-brown {cursor: pointer;  font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/camel4.jpg");  margin-right: 15px;}' +
      '.a-button-ornements-gold {cursor: pointer;  font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Ornements/gold.jpg"); margin-right: 15px;}' +
      '.a-button-ornements-metalgrey {cursor: pointer;  font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Ornements/metalGrey.jpg");  margin-right: 15px;}' +
      '.a-button-ornements-metalblack {cursor: pointer; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/full-black2.jpg");  margin-right: 15px;}' +
      '.a-button-handle-beige {cursor: pointer; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/Texture_1_baseColor.jpeg"); margin-right: 15px;}' +
      '.a-button-handle-black {cursor: pointer; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/full-black2.jpg");  margin-right: 15px;}' +
      '.a-button-handle-brown {cursor: pointer; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 40px; max-width: 110px; border-radius: 50%; height: 40px; background-image: url("images/Outside/camel4.jpg");  margin-right: 15px;}' +
      
      '.a-upload-model-button:hover {border-color: #ef2d5e; color: #ef2d5e}' +
      '.a-upload-model-input {color: #666; vertical-align: middle; padding: 0px 10px 0 10px; text-transform: uppercase; border: 0; width: 75%; height: 100%; border-radius: 10px; margin-right: 10px}' +
      '@media only screen and (max-width: 800px) {' +
      '.a-upload-model {margin: auto;}' +
      '.a-upload-model-input {width: 70%;}}' +
      '@media only screen and (max-width: 700px) {' +
      '.a-upload-model {display: none}}'+
      
      '.a-edit-button-container {position: absolute; top: 25px; right: 20px;}'+
      //'.a-edit-container {position: absolute; top: 200px; right: 20px; width: fit-content; height: fit-content ; background-color: white;padding-top: 15px; padding-bottom: 15px; padding-left: 15px; padding-right: 15px; }'+
      '.a-edit-container {height: 100%; width: 0; position: fixed; z-index: 1; top: 0; right: 0; background: rgb(17, 17, 17,0.8); overflow-x: hidden; transition: 0.5s; padding-top: 30px;}'+
      //'.a-edit-container.hidden {display: none}'+
      '.a-edit-container.hidden {width: 25%}'+
      '@media only screen and (max-width: 700px) {' +
      '.a-edit-container.hidden {width: 100%}}'+
      '.a-edit-title {color: white; font-size: 30px; padding-left: 35px; padding-bottom: 60px; width: 100%}'+
      '.a-edit-close-button {background: rgba(0, 0, 0, 0); color: white; min-width: 58px; min-height: 34px; border-radius: 8px; border: 0px solid #92d050; font-size: 30px; font-weight: bold; cusor: pointer; position: absolute; right: 15px; transition: 0.3s;}'+
      '.a-edit-close-button:hover {color: #a1a1a1;}'+
      '.a-edit-close-button:before { content: "\\f061"; display: inline-block; font: normal normal normal 14px/1 FontAwesome;  font-size: inherit;  text-rendering: auto; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }'+ 
      
      '.a-edit-button {background: #111; color: white; min-width: 58px; min-height: 34px; border-radius: 8px; border: 0px solid #92d050; font-size: 20px; padding: 10px; cusor: pointer;}'+
      '.a-edit-button:hover {color: #a1a1a1;}'+
      '.a-edit-button.hidden {display: none;}'+
      '.a-edit-button:before { content: "\\f044"; display: inline-block; font: normal normal normal 14px/1 FontAwesome;  font-size: inherit;  text-rendering: auto; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }'+

      '.a-edit-part-container {display: inline-block; padding-top: 15px; padding-bottom: 30px; padding-left: 60px; padding-right: 15px; transition: 0.3s;}';
    var inputDefaultValue = this.inputDefaultValue = 'Copy URL to glTF or glb model';

    if (AFRAME.utils.device.checkARSupport()) {
      css += '@media only screen and (max-width: 800px) {' +
      '.a-upload-model-input {width: 60%;}}';
    }

    //scoreContainer.classList.add('a-score');
    //scoreContainer.innerText = "Score :";
    //scoreContainer.innerText = this.data.ScoreHtml.data;

    uploadContainerEl.classList.add('a-upload-model');
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    //Outside
    outside.classList.add('a-text-color-change');
    outside.innerText = "Outside";

    outisdeBeige.classList.add('a-button-outside-beige');
    outisdeBeige.addEventListener('click', function() {changeMaterial("Outside", 1, "images/Outside/Texture_1_baseColor.jpeg");});
    outisdeBeige.setAttribute('title', 'material1');

    outisdeBlack.classList.add('a-button-outside-black');
    outisdeBlack.addEventListener('click', function(){changeMaterial("Outside", 2, "images/Outside/full-black2.jpg");});
    outisdeBlack.setAttribute('title', 'material2');

    outisdeBrown.classList.add('a-button-outside-brown');
    outisdeBrown.addEventListener('click', function(){changeMaterial("Outside", 3, "images/Outside/camel4.jpg");});
    outisdeBrown.setAttribute('title', 'material3');

    //Ornements
    ornements.classList.add('a-text-color-change');
    ornements.innerText = "Ornements";

    ornementsBeige.classList.add('a-button-ornements-gold');
    ornementsBeige.addEventListener('click', function(){changeMaterial("Ornements", 9,"images/Ornements/gold.jpg");});
    ornementsBeige.setAttribute('title', 'material4');

    ornementsBlack.classList.add('a-button-ornements-metalgrey');
    ornementsBlack.addEventListener('click', function(){changeMaterial("Ornements", 10, "images/Ornements/metalGrey.jpg");});
    ornementsBlack.setAttribute('title', 'material5');

    ornementsBrown.classList.add('a-button-ornements-metalblack');
    ornementsBrown.addEventListener('click', function(){changeMaterial("Ornements", 11, "images/Outside/full-black2.jpg");});
    ornementsBrown.setAttribute('title', 'material6');

    //Handle
    handle.classList.add('a-text-color-change');
    handle.innerText = "Handle";

    handle1.classList.add('a-button-outside-beige');
    handle1.addEventListener('click', function(){changeMaterial("Hance1", 13, "images/Outside/Texture_1_baseColor.jpeg");});
    handle1.setAttribute('title', 'material1');

    handle2.classList.add('a-button-outside-black');
    handle2.addEventListener('click', function(){changeMaterial("Hance1", 14, "images/Outside/full-black2.jpg");});
    handle2.setAttribute('title', 'material2');

    handle3.classList.add('a-button-outside-brown');
    handle3.addEventListener('click', function(){changeMaterial("Hance1", 15, "images/Outside/camel4.jpg");});
    handle3.setAttribute('title', 'material3');

    editButtonContainer.classList.add('a-edit-button-container');
    editContainer.classList.add('a-edit-container');
    
    editButton.classList.add('a-edit-button');
    editButton.innerHTML = " Customize";
    editButton.addEventListener('click', function () {
      //console.log("hidden");
      
      if (editContainer.classList.contains('hidden')) {
        editContainer.classList.remove('hidden');
        editButton.classList.remove('hidden');
      }
      else {
        editContainer.classList.add('hidden');
        editButton.classList.add('hidden');
      }
    });

    editTitle.classList.add('a-edit-title');
    editTitle.innerText = "Customize";

    editCloseButton.classList.add('a-edit-close-button');
    editCloseButton.addEventListener('click', function () {
      //console.log("hidden");
      
      if (editContainer.classList.contains('hidden')) {
        editContainer.classList.remove('hidden');
        editButton.classList.remove('hidden');
      }
      else {
        editContainer.classList.add('hidden');
        editButton.classList.add('hidden');
      }
    });

    editOutsideContainer.classList.add('a-edit-part-container'); 
    editOrnementsContainer.classList.add('a-edit-part-container');
    editHandleContainer.classList.add('a-edit-part-container');

    this.el.sceneEl.addEventListener('infomessageopened', function () {
      uploadContainerEl.classList.add('hidden');
    });
    this.el.sceneEl.addEventListener('infomessageclosed', function () {
      uploadContainerEl.classList.remove('hidden');
    });

    //inputEl.value = inputDefaultValue;

    //uploadContainerEl.appendChild(inputEl);
    editButtonContainer.appendChild(editButton);
    
    editContainer.appendChild(editTitle);
    editTitle.appendChild(editCloseButton);

    editContainer.appendChild(outside);
    editOutsideContainer.appendChild(outisdeBeige);
    editOutsideContainer.appendChild(outisdeBlack);
    editOutsideContainer.appendChild(outisdeBrown);  
    editContainer.appendChild(editOutsideContainer);

    editContainer.appendChild(ornements);
    editOrnementsContainer.appendChild(ornementsBeige);
    editOrnementsContainer.appendChild(ornementsBlack);
    editOrnementsContainer.appendChild(ornementsBrown);
    editContainer.appendChild(editOrnementsContainer);

    editContainer.appendChild(handle);
    editHandleContainer.appendChild(handle1);
    editHandleContainer.appendChild(handle2);
    editHandleContainer.appendChild(handle3);
    editContainer.appendChild(editHandleContainer);

    //this.el.sceneEl.appendChild(scoreContainer);
    this.el.sceneEl.appendChild(uploadContainerEl);
    this.el.sceneEl.appendChild(editButtonContainer);
    this.el.sceneEl.appendChild(editContainer);
    
  },

  update: function () {
    if (!this.data.gltfModel) { return; }
    this.modelEl.setAttribute('gltf-model', this.data.gltfModel);
  },

  submitURLButtonClicked: function (color) {
    /*var modelURL = this.inputEl.value;
    if (modelURL === this.inputDefaultValue) { return; }
    this.el.setAttribute('model-viewer', 'gltfModel', modelURL);*/
    console.log(color); 
    
    this.modelEl.object3D.traverse(function(object3D){
      var mat = object3D.material
      if (mat) {
        console.log("mat : " + object3D.material);
        if (object3D.name == "Cube")
          object3D.material = new THREE.MeshStandardMaterial({color: 0x000000});
      }
    })
  },

  initCameraRig: function () {
    var cameraRigEl = this.cameraRigEl = document.createElement('a-entity');
    var cameraEl = this.cameraEl = document.createElement('a-entity');
    var rightHandEl = this.rightHandEl = document.createElement('a-entity');
    var leftHandEl = this.leftHandEl = document.createElement('a-entity');

    cameraEl.setAttribute('camera', {fov: 60});
    cameraEl.setAttribute('look-controls', {
      magicWindowTrackingEnabled: false,
      mouseEnabled: false,
      touchEnabled: false
    });

    rightHandEl.setAttribute('rotation', '0 90 0');
    rightHandEl.setAttribute('laser-controls', {hand: 'right'});
    rightHandEl.setAttribute('raycaster', {objects: '.raycastable'});
    rightHandEl.setAttribute('line', {color: '#118A7E'});

    leftHandEl.setAttribute('rotation', '0 90 0');
    leftHandEl.setAttribute('laser-controls', {hand: 'right'});
    leftHandEl.setAttribute('raycaster', {objects: '.raycastable'});
    leftHandEl.setAttribute('line', {color: '#118A7E'});

    cameraRigEl.appendChild(cameraEl);
    cameraRigEl.appendChild(rightHandEl);
    cameraRigEl.appendChild(leftHandEl);

    this.el.appendChild(cameraRigEl);
  },

  initBackground: function () {
    var backgroundEl = this.backgroundEl = document.querySelector('a-entity');
    //backgroundEl.setAttribute('geometry', {primitive: 'sphere', radius: 65});
    /*backgroundEl.setAttribute('material', {
      shader: 'background-gradient',
      colorTop: '#37383c',
      colorBottom: '#757575',
      side: 'back'
    });*/
    //backgroundEl.setAttribute('material', 'images/background/Luxury-Backgrounds-4.jpg');
    backgroundEl.setAttribute('hide-on-enter-ar', '');
  },

  initEntities: function () {
    // Container for our entities to keep the scene clean and tidy.
    var containerEl = this.containerEl = document.createElement('a-entity');
    // Plane used as a hit target for laser controls when in VR mode
    var laserHitPanelEl = this.laserHitPanelEl = document.createElement('a-entity');
    // Models are often not centered on the 0,0,0.
    // We will center the model and rotate a pivot.
    var modelPivotEl = this.modelPivotEl = document.createElement('a-entity');
    // This is our glTF model entity.
    var modelEl = this.modelEl = document.createElement('a-entity');
    // Shadow blurb for 2D and VR modes. Scaled to match the size of the model.
    var shadowEl = this.shadowEl = document.createElement('a-entity');
    // Real time shadow only used in AR mode.
    var arShadowEl = this.arShadowEl = document.createElement('a-entity');
    // The title / legend displayed above the model.
    var titleEl = this.titleEl = document.createElement('a-entity');
    // Reticle model used to position the model in AR mode.
    var reticleEl = this.reticleEl = document.createElement('a-entity');
    // Scene ligthing.
    var lightEl = this.lightEl = document.createElement('a-entity');
    var sceneLightEl = this.sceneLightEl = document.createElement('a-entity');

    sceneLightEl.setAttribute('light', {
      type: 'hemisphere',
      intensity: 1
    });

    modelPivotEl.id = 'modelPivot';

    this.el.appendChild(sceneLightEl);

    reticleEl.setAttribute('gltf-model', '#reticle');
    reticleEl.setAttribute('scale', '0.8 0.8 0.8');
    reticleEl.setAttribute('ar-hit-test', {targetEl: '#modelPivot'});
    reticleEl.setAttribute('visible', 'false');

    modelEl.id = 'model';

    laserHitPanelEl.id = 'laserHitPanel';
    laserHitPanelEl.setAttribute('position', '0 0 -10');
    laserHitPanelEl.setAttribute('geometry', 'primitive: plane; width: 30; height: 20');
    laserHitPanelEl.setAttribute('material', 'color: red');
    laserHitPanelEl.setAttribute('visible', 'false');
    laserHitPanelEl.classList.add('raycastable');

    this.containerEl.appendChild(laserHitPanelEl);

    modelEl.setAttribute('rotation', '0 -30 0');
    modelEl.setAttribute('animation-mixer', '');
    modelEl.setAttribute('shadow', 'cast: true; receive: false');

    modelPivotEl.appendChild(modelEl);

    shadowEl.setAttribute('rotation', '-90 -30 0');
    shadowEl.setAttribute('geometry', 'primitive: plane; width: 1.0; height: 1.0');
    shadowEl.setAttribute('material', 'src: #shadow; transparent: true; opacity: 0.40');
    shadowEl.setAttribute('hide-on-enter-ar', '');

    modelPivotEl.appendChild(shadowEl);

    arShadowEl.setAttribute('rotation', '-90 0 0');
    arShadowEl.setAttribute('geometry', 'primitive: plane; width: 30.0; height: 30.0');
    arShadowEl.setAttribute('shadow', 'recieve: true');
    arShadowEl.setAttribute('ar-shadows', 'opacity: 0.2');
    arShadowEl.setAttribute('visible', 'false');

    modelPivotEl.appendChild(arShadowEl);

    titleEl.id = 'title';
    titleEl.setAttribute('text', 'value: ' + this.data.title + '; width: 6');
    titleEl.setAttribute('hide-on-enter-ar', '');
    titleEl.setAttribute('visible', 'false');

    this.containerEl.appendChild(titleEl);

    lightEl.id = 'light';
    lightEl.setAttribute('position', '-2 4 2');
    lightEl.setAttribute('light', {
      type: 'directional',
      castShadow: true,
      shadowMapHeight: 1024,
      shadowMapWidth: 1024,
      shadowCameraLeft: -7,
      shadowCameraRight: 5,
      shadowCameraBottom: -5,
      shadowCameraTop: 5,
      intensity: 1,
      target: 'modelPivot'
    });

    this.containerEl.appendChild(lightEl);
    this.containerEl.appendChild(modelPivotEl);

    this.el.appendChild(containerEl);
    this.el.appendChild(reticleEl);
  },

  onThumbstickMoved: function (evt) {
    var modelPivotEl = this.modelPivotEl;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
    modelScale -= evt.detail.y / 20;
    modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
    this.modelScale = modelScale;
  },

  onMouseWheel: function (evt) {
    var modelPivotEl = this.modelPivotEl;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
    modelScale -= evt.deltaY / 100;
    modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
    // Clamp scale.
    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
    this.modelScale = modelScale;
  },

  onMouseDownLaserHitPanel: function (evt) {
    var cursorEl = evt.detail.cursorEl;
    var intersection = cursorEl.components.raycaster.getIntersection(this.laserHitPanelEl);
    if (!intersection) { return; }
    cursorEl.setAttribute('raycaster', 'lineColor', 'white');
    this.activeHandEl = cursorEl;
    this.oldHandX = undefined;
    this.oldHandY = undefined;
  },

  onMouseUpLaserHitPanel: function (evt) {
    var cursorEl = evt.detail.cursorEl;
    if (cursorEl === this.leftHandEl) { this.leftHandPressed = false; }
    if (cursorEl === this.rightHandEl) { this.rightHandPressed = false; }
    cursorEl.setAttribute('raycaster', 'lineColor', 'white');
    if (this.activeHandEl === cursorEl) { this.activeHandEl = undefined; }
  },

  onOrientationChange: function () {
    if (AFRAME.utils.device.isLandscape()) {
      this.cameraRigEl.object3D.position.z -= 1;
    } else {
      this.cameraRigEl.object3D.position.z += 1;
    }
  },

  tick: function () {
    var modelPivotEl = this.modelPivotEl;
    var intersection;
    var intersectionPosition;
    var laserHitPanelEl = this.laserHitPanelEl;
    var activeHandEl = this.activeHandEl;
    if (!this.el.sceneEl.is('vr-mode')) { return; }
    if (!activeHandEl) { return; }
    intersection = activeHandEl.components.raycaster.getIntersection(laserHitPanelEl);
    if (!intersection) {
      activeHandEl.setAttribute('raycaster', 'lineColor', 'white');
      return;
    }
    activeHandEl.setAttribute('raycaster', 'lineColor', '#007AFF');
    intersectionPosition = intersection.point;
    this.oldHandX = this.oldHandX || intersectionPosition.x;
    this.oldHandY = this.oldHandY || intersectionPosition.y;

    modelPivotEl.object3D.rotation.y -= (this.oldHandX - intersectionPosition.x) / 4;
    modelPivotEl.object3D.rotation.x += (this.oldHandY - intersectionPosition.y) / 4;

    this.oldHandX = intersectionPosition.x;
    this.oldHandY = intersectionPosition.y;
  },

  onEnterVR: function () {
    var cameraRigEl = this.cameraRigEl;

    this.cameraRigPosition = cameraRigEl.object3D.position.clone();
    this.cameraRigRotation = cameraRigEl.object3D.rotation.clone();

    if (!this.el.sceneEl.is('ar-mode')) {
      cameraRigEl.object3D.position.set(0, 0, 2);
    } else {
      cameraRigEl.object3D.position.set(0, 0, 0);
    }
  },

  onExitVR: function () {
    var cameraRigEl = this.cameraRigEl;

    cameraRigEl.object3D.position.copy(this.cameraRigPosition);
    cameraRigEl.object3D.rotation.copy(this.cameraRigRotation);

    cameraRigEl.object3D.rotation.set(0, 0, 0);
  },

  onTouchMove: function (evt) {
    if (evt.touches.length === 1) { this.onSingleTouchMove(evt); }
    if (evt.touches.length === 2) { this.onPinchMove(evt); }
  },

  onSingleTouchMove: function (evt) {
    var dX;
    var dY;
    var modelPivotEl = this.modelPivotEl;
    this.oldClientX = this.oldClientX || evt.touches[0].clientX;
    this.oldClientY = this.oldClientY || evt.touches[0].clientY;

    dX = this.oldClientX - evt.touches[0].clientX;
    dY = this.oldClientY - evt.touches[0].clientY;

    modelPivotEl.object3D.rotation.y -= dX / 200;
    this.oldClientX = evt.touches[0].clientX;

    modelPivotEl.object3D.rotation.x -= dY / 100;

    // Clamp x rotation to [-90,90]
    modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
    this.oldClientY = evt.touches[0].clientY;
  },

  onPinchMove: function (evt) {
    var dX = evt.touches[0].clientX - evt.touches[1].clientX;
    var dY = evt.touches[0].clientY - evt.touches[1].clientY;
    var modelPivotEl = this.modelPivotEl;
    var distance = Math.sqrt(dX * dX + dY * dY);
    var oldDistance = this.oldDistance || distance;
    var distanceDifference = oldDistance - distance;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;

    modelScale -= distanceDifference / 500;
    modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
    // Clamp scale.
    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);

    this.modelScale = modelScale;
    this.oldDistance = distance;
  },

  onTouchEnd: function (evt) {
    this.oldClientX = undefined;
    this.oldClientY = undefined;
    if (evt.touches.length < 2) { this.oldDistance = undefined; }
  },

  onMouseUp: function (evt) {
    this.leftRightButtonPressed = false;
    if (evt.buttons === undefined || evt.buttons !== 0) { return; }
    this.oldClientX = undefined;
    this.oldClientY = undefined;
  },

  onMouseMove: function (evt) {
    if (this.leftRightButtonPressed) {
      this.dragModel(evt);
    } else {
      this.rotateModel(evt);
    }
  },

  dragModel: function (evt) {
    var dX;
    var dY;
    var modelPivotEl = this.modelPivotEl;
    if (!this.oldClientX) { return; }
    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;
    modelPivotEl.object3D.position.y += dY / 200;
    modelPivotEl.object3D.position.x -= dX / 200;
    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },

  rotateModel: function (evt) {
    var dX;
    var dY;
    var modelPivotEl = this.modelPivotEl;
    if (!this.oldClientX) { return; }
    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;
    modelPivotEl.object3D.rotation.y -= dX / 100;
    modelPivotEl.object3D.rotation.x -= dY / 200;

    // Clamp x rotation to [-90,90]
    modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);

    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },

  onModelLoaded: function () {
    this.centerAndScaleModel();
  },

  centerAndScaleModel: function () {
    var box;
    var size;
    var center;
    var scale;
    var modelEl = this.modelEl;
    var shadowEl = this.shadowEl;
    var titleEl = this.titleEl;
    var gltfObject = modelEl.getObject3D('mesh');

    // Reset position and scales.
    modelEl.object3D.position.set(0, 0, 0);
    modelEl.object3D.scale.set(1.0, 1.0, 1.0);
    this.cameraRigEl.object3D.position.z = 3.0;

    // Calculate model size.
    modelEl.object3D.updateMatrixWorld();
    box = new THREE.Box3().setFromObject(gltfObject);
    size = box.getSize(new THREE.Vector3());

    // Calculate scale factor to resize model to human scale.
    scale = 1.6 / size.y;
    scale = 2.0 / size.x < scale ? 2.0 / size.x : scale;
    scale = 2.0 / size.z < scale ? 2.0 / size.z : scale;

    modelEl.object3D.scale.set(scale, scale, scale);

    // Center model at (0, 0, 0).
    modelEl.object3D.updateMatrixWorld();
    box = new THREE.Box3().setFromObject(gltfObject);
    center = box.getCenter(new THREE.Vector3());
    size = box.getSize(new THREE.Vector3());

    shadowEl.object3D.scale.y = size.x;
    shadowEl.object3D.scale.x = size.y;
    shadowEl.object3D.position.y = -size.y / 2;
    shadowEl.object3D.position.z = -center.z;
    shadowEl.object3D.position.x = -center.x;

    titleEl.object3D.position.x = 2.2 - center.x;
    titleEl.object3D.position.y = size.y + 0.5;
    titleEl.object3D.position.z = -2;
    titleEl.object3D.visible = true;

    modelEl.object3D.position.x = -center.x;
    modelEl.object3D.position.y = -center.y;
    modelEl.object3D.position.z = -center.z;

    // When in mobile landscape we want to bring the model a bit closer.
    if (AFRAME.utils.device.isLandscape()) { this.cameraRigEl.object3D.position.z -= 1; }
  },

  onMouseDown: function (evt) {
    if (evt.buttons) { this.leftRightButtonPressed = evt.buttons === 3; }
    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  }
});
