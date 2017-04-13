import './toaster.css';

export class Toaster {
  static create(msg, options) {
    var toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      document.body.appendChild(toastContainer);
    }
    options = options || {};
    var tag = options.tag || (Date.now().toString());
    Array.from(toastContainer.querySelectorAll(`.toast[data-tag="${tag}"]`))
      .forEach(t => {
        t.parentNode.removeChild(t);
      });

    // Make a toast...
    var toast = document.createElement('div');
    var toastContent = document.createElement('div');
    toast.classList.add('toast');
    toastContent.classList.add('toast__content');
    toastContent.textContent = msg;
    toast.appendChild(toastContent);
    toast.dataset.tag = tag;
    toastContainer.appendChild(toast);

    // Wait a few seconds, then fade it...
    var timeout = options.timeout || 3000;
    setTimeout(() => {
      toast.classList.add('toast--dismissed');
    }, timeout);

    // After which, remove it altogether.
    toast.addEventListener('transitionend', function (evt) {
      evt.target.parentNode.removeChild(evt.target);
    });
  }
}