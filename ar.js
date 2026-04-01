document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const overlay = document.getElementById('permission-overlay');
  const scene = document.querySelector('a-scene');

  startBtn.addEventListener('click', async () => {
    try {
      // 1. Request iOS Motion Permissions
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response !== 'granted') return alert("Motion permission denied");
      }

      // 2. Play the scene (starts the camera)
      scene.play();
      overlay.style.display = 'none';
    } catch (err) {
      alert("Initialization error: " + err);
    }
  });
});