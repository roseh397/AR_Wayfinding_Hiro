//OLD EXAMPLE PATH - FOR DOCUMENTATION
const FEET_TO_METERS = 0.3048;

AFRAME.registerComponent('nav-engine', {
  init: function() {
    this.currentStep = 1; 
    this.scaleFactor = 0.123; 
    this.arrivalThresholdFeet = 3.0; 
    
    this.arrow = document.getElementById('nav-arrow');
    this.stepText = document.getElementById('step-val');
    this.distText = document.getElementById('dist-val');
    
    this.markerEl = document.getElementById('markerA');
    this.markerE2 = document.getElementById('markerB');
    this.markerE3 = document.getElementById('markerC');
  },

  updateArrowForMarker: function(marker, nextStep) {
    if (!marker || !marker.object3D.visible) {
      return false; // Marker not visible
    }

    const mPos = marker.object3D.position;

    // 1. Calculate Distance
    const rawDist = Math.sqrt(mPos.x*mPos.x + mPos.y*mPos.y + mPos.z*mPos.z);
    const distFeet = (rawDist * this.scaleFactor) / FEET_TO_METERS;

    this.stepText.innerText = "WALK STRAIGHT";
    this.distText.innerText = distFeet.toFixed(1);

    // 2. Calculate Arrow Rotation
    const angleRad = Math.atan2(mPos.x, mPos.z);
    const angleDeg = angleRad * (180 / Math.PI);
    this.arrow.setAttribute('rotation', `0 0 ${angleDeg + 180}`);

    // 3. Distance Colors & Step Advancement
    if (distFeet <= this.arrivalThresholdFeet) {
      this.arrow.setAttribute('material', 'color', '#00ff00');
      this.currentStep = nextStep;
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else if (distFeet < 6.0) {
      this.arrow.setAttribute('material', 'color', 'yellow');
    } else {
      this.arrow.setAttribute('material', 'color', '#00ffff');
    }
    return true;
  },

  tick: function() {
    // STEP 1: Search for and walk to markerA
    if (this.currentStep === 1) {
      if (this.updateArrowForMarker(this.markerEl, 2)) {
        return;
      }
      this.stepText.innerText = "FIND AR MARKER";
      this.distText.innerText = "---";
      return;
    }

    // STEP 2: The Turn Right (advance to step 3 when markerA is out of sight)
    if (this.currentStep === 2) {
      this.stepText.innerText = "TURN RIGHT";
      this.distText.innerText = "---";
      this.arrow.setAttribute('material', 'color', '#00ff00');
      this.arrow.setAttribute('rotation', '0 0 -90');
      
      // Advance to searching for markerB when markerA is no longer visible
      if (!this.markerEl || !this.markerEl.object3D.visible) {
        this.currentStep = 3;
      }
      return; 
    }

    // STEP 3: Search for and walk to markerB
    if (this.currentStep === 3) {
      if (this.updateArrowForMarker(this.markerE2, 4)) {
        return;
      }
      this.stepText.innerText = "FIND AR MARKER";
      this.distText.innerText = "---";
      return;
    }

    // STEP 4: The Turn Left
    if (this.currentStep === 4) {
      this.stepText.innerText = "TURN LEFT";
      this.distText.innerText = "---";
      this.arrow.setAttribute('material', 'color', '#00ff00');
      this.arrow.setAttribute('rotation', '0 0 90');

      // Advance to searching for markerC when markerB is no longer visible
      if (!this.markerE2 || !this.markerE2.object3D.visible) {
        this.currentStep = 5;
      }

      return; 
    }

    // STEP 5: Search for and walk to markerC
    if (this.currentStep === 5) {
      if (this.updateArrowForMarker(this.markerE3, 6)) {
        return;
      }
      this.stepText.innerText = "FIND AR MARKER";
      this.distText.innerText = "---";
      return;
    }

    // STEP 6: Arrival at destination
    if (this.currentStep === 6) {
      this.stepText.innerText = "ARRIVED AT DESTINATION";
      this.distText.innerText = "---";
      this.arrow.setAttribute('material', 'color', '#00ff00');

      return; 
    }

  }
});