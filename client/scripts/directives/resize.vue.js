Vue.directive('resize', {
  inserted: function (el) {
    '<span class="col-resizer"></span>'
    let resizer = document.createElement('span');
    resizer.className = 'col-resizer';
    el.appendChild(resizer);
  }
});