if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
  
    deferredInstallPrompt = event;
  
    installButton.style.display = 'block';
});

installButton.addEventListener('click', () => {
    deferredInstallPrompt.prompt();
  
    deferredInstallPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Korisnik je prihvatio instalaciju');
            } else {
                console.log('Korisnik nije prihvatio instalaciju');
            }
            deferredInstallPrompt = null;
        });
});

const captureButton = document.getElementById('captureButton');
const videoEl = document.getElementById('videoElement');

captureButton.addEventListener('click', async () => {
    try {
        videoEl.style.display = 'block';
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoEl.srcObject = stream;

        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const photoBlob = await imageCapture.takePhoto();
        const imageUrl = URL.createObjectURL(photoBlob);

        const imgElement = document.createElement('img');
        imgElement.style.width = '200px';
        imgElement.style.height = '300px';
        imgElement.src = imageUrl;
        document.body.appendChild(imgElement);

        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(function (permission) {
              if (permission === 'granted') {
                showNotification('The photo is captured!', 'success');
              }
            });
          } else {
            showNotification('The photo is captured!', 'success');
        }

        track.stop();
        videoEl.srcObject = null;
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showNotification('Error while accessing camera.', 'error');
    }
});

function showNotification(message, type) {
    const notification = new Notification('Travel Journal', {
        body: message,
        icon: type === 'success' ? 'success.png' : 'error.png', 
      });
}

document.addEventListener('DOMContentLoaded', function() {
    var advancedFeature = document.getElementById('advanced-feature');
  
    if (advancedFeature) {
      if (supportsAdvancedFeature()) {
        advancedFeature.style.display = 'block';
      } else {
        displayNotSupportedMessage();
        console.log('Advanced feature not supported.');
      }
    }
  });
  
function supportsAdvancedFeature() {
    return ('someAdvancedAPI' in window);
}
function displayNotSupportedMessage() {
    var messageContainer = document.createElement('div');
    messageContainer.className = 'not-supported-message';
    messageContainer.innerHTML = 'Sorry, this advanced feature is not supported in your browser.';
  
    document.body.appendChild(messageContainer);
  }


