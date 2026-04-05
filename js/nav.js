const FEET_TO_METERS = 0.3048;

AFRAME.registerComponent('nav-engine', {
  init: function() {
    this.currentStep = 1; 
    this.scaleFactor = 0.123; 
    this.arrivalThresholdFeet = 2.0; 
    
    this.arrow = document.getElementById('nav-arrow');
    this.stepText = document.getElementById('step-val');
    this.distText = document.getElementById('dist-val');
    this.markerEl = document.getElementById('markerA');
  },

  tick: function() {
    // STEP 2: The Turn Right
    if (this.currentStep === 2) {
      this.stepText.innerText = "STEP 2: TURN RIGHT";
      this.distText.innerText = "---";
      this.arrow.setAttribute('material', 'color', '#00ff00');
      
      // Points the triangle to the RIGHT (90 degrees clockwise)
      this.arrow.setAttribute('rotation', '0 0 -90');
      return; 
    }

    if (this.markerEl && this.markerEl.object3D.visible) {
      const mPos = this.markerEl.object3D.position;

      // 1. Calculate Distance
      const rawDist = Math.sqrt(mPos.x*mPos.x + mPos.y*mPos.y + mPos.z*mPos.z);
      const distFeet = (rawDist * this.scaleFactor) / FEET_TO_METERS;

      this.stepText.innerText = "WALK STRAIGHT";
      this.distText.innerText = distFeet.toFixed(1);

      // 2. THE ARROW FIX: Pointing UP for Forward
      // We flip the angle so the "Up" vertex points toward the marker
      const angleRad = Math.atan2(mPos.x, mPos.z);
      const angleDeg = angleRad * (180 / Math.PI);
      
      // Using (angleDeg + 180) to flip it from Down to Up
      this.arrow.setAttribute('rotation', `0 0 ${angleDeg + 180}`);

      // 3. Distance Colors
      if (distFeet <= this.arrivalThresholdFeet) {
        this.arrow.setAttribute('material', 'color', '#00ff00');
        if (this.currentStep === 1) {
            this.currentStep = 2;
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      } else if (distFeet < 6.0) {
        this.arrow.setAttribute('material', 'color', 'yellow');
      } else {
        this.arrow.setAttribute('material', 'color', '#00ffff');
      }

    } else {
      this.stepText.innerText = "FIND AR MARKER";
      this.distText.innerText = "---";
    }
  }
});