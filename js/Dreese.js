const FEET_TO_METERS = 0.3048;

AFRAME.registerComponent('nav-engine', {
  init: function() {
    this.currentStep = 1;
    this.scaleFactor = 0.123;
    this.arrivalThresholdFeet = 3.0;

    this.arrow = document.getElementById('nav-arrow');
    this.stepText = document.getElementById('step-val');
    this.distText = document.getElementById('dist-val');

    this.markerA = document.getElementById('markerA');
    this.markerB = document.getElementById('markerB');
    this.markerC = document.getElementById('markerC');
    this.markerD = document.getElementById('markerD');
    this.markerE = document.getElementById('markerE');
  },

  updateArrowForMarker: function(marker, nextStep) {
    if (!marker || !marker.object3D.visible) {
      return false;
    }

    const mPos = marker.object3D.position;
    const rawDist = Math.sqrt(mPos.x * mPos.x + mPos.y * mPos.y + mPos.z * mPos.z);
    const distFeet = (rawDist * this.scaleFactor) / FEET_TO_METERS;

    this.stepText.innerText = 'WALK STRAIGHT';
    this.distText.innerText = distFeet.toFixed(1);

    const angleRad = Math.atan2(mPos.x, mPos.z);
    const angleDeg = angleRad * (180 / Math.PI);
    this.arrow.setAttribute('rotation', `0 0 ${angleDeg + 180}`);

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

  showTurnInstruction: function(text, rotation, markerToLose, nextStep) {
    this.stepText.innerText = text;
    this.distText.innerText = '---';
    this.arrow.setAttribute('material', 'color', '#00ff00');
    this.arrow.setAttribute('rotation', rotation);

    if (!markerToLose || !markerToLose.object3D.visible) {
      this.currentStep = nextStep;
    }
  },

  tick: function() {
    if (this.currentStep === 1) {
      if (this.updateArrowForMarker(this.markerA, 2)) return;
      this.stepText.innerText = 'FIND FIRST HIRO MARKER';
      this.distText.innerText = '---';
      return;
    }

    if (this.currentStep === 2) {
      this.showTurnInstruction('TURN LEFT', '0 0 90', this.markerA, 3);
      return;
    }

    if (this.currentStep === 3) {
      if (this.updateArrowForMarker(this.markerB, 4)) return;
      this.stepText.innerText = 'FIND SECOND HIRO MARKER';
      this.distText.innerText = '---';
      this.arrow.setAttribute('rotation', '0 0 0');
      return;
    }

    if (this.currentStep === 4) {
      this.showTurnInstruction('TURN LEFT', '0 0 90', this.markerB, 5);
      return;
    }

    if (this.currentStep === 5) {
      if (this.updateArrowForMarker(this.markerC, 6)) return;
      this.stepText.innerText = 'FIND THIRD HIRO MARKER';
      this.distText.innerText = '---';
      this.arrow.setAttribute('rotation', '0 0 0');
      return;
    }

    if (this.currentStep === 6) {
      this.showTurnInstruction('TURN LEFT', '0 0 90', this.markerC, 7);
      return;
    }

    if (this.currentStep === 7) {
      if (this.updateArrowForMarker(this.markerD, 8)) return;
      this.stepText.innerText = 'FIND FOURTH HIRO MARKER';
      this.distText.innerText = '---';
      this.arrow.setAttribute('rotation', '0 0 0');
      return;
    }

    if (this.currentStep === 8) {
      this.showTurnInstruction('TURN RIGHT', '0 0 -90', this.markerD, 9);
      return;
    }

    if (this.currentStep === 9) {
      if (this.updateArrowForMarker(this.markerE, 10)) return;
      this.stepText.innerText = 'FIND FIFTH HIRO MARKER';
      this.distText.innerText = '---';
      this.arrow.setAttribute('rotation', '0 0 0');
      return;
    }

    if (this.currentStep === 10) {
      // this.showTurnInstruction('YOUR DESTINATION IS ON THE RIGHT', '0 0 -90', this.markerD, 9);
      // //this.stepText.innerText = 'YOUR DESTINATION IS ON THE RIGHT';
      // this.distText.innerText = '---';
      // this.arrow.setAttribute('material', 'color', '#00ff00');
      // return;

      // 1. Set the final instructions
      this.stepText.innerText = 'DESTINATION IS ON THE RIGHT';
      this.distText.innerText = 'ARRIVED';
      
      // 2. Set the arrow to point Right (-90) and stay Green
      this.arrow.setAttribute('rotation', '0 0 -90');
      this.arrow.setAttribute('material', 'color', '#00ff00');
      
      // 3. We do NOT call this.showTurnInstruction here, 
      // so currentStep stays at 10 and the loop "rests" here.
      return;
    }
    }
  }
});
