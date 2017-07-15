Vue.component('sql-editor', {
  data: function() {
    return {
      internalValue: ''
    }
  },
  template: '<div class="sql-editor"></div>',
  props: ['value'],
  watch: {
    internalValue: function() {
      this.$emit('input', this.internalValue);
    }
  },
  mounted: function() {
    let self = this;
    console.log('Created');
    console.log(this);
    setTimeout(() => {
      let editor = CodeMirror(this.$el, {
        mode: 'text/x-mssql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        hintOptions: {tables: {
          users: {name: null, score: null, birthDate: null},
          countries: {name: null, population: null, size: null}
          }
        }
      });
      editor.on('change', function(cm) {
        self.content = cm.getValue();
        self.$emit('input', self.content);
      });
      editor.refresh();

      this.$el.addEventListener('keydown', (event) => {
        if (event.key == 'F5') {
          self.$emit('run');
        }
      });
    });
  },
  created: function() {
    this.internalValue = this.value;
  }
});