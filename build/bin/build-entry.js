var Components = require('../../components.json')
var fs = require('fs')
var render = require('json-templater/string')
var uppercamelcase = require('uppercamelcase')
var path = require('path')
var endOfLine = require('os').EOL

var OUTPUT_PATH = path.join(__dirname, '../../src/index.js')
var IMPORT_TEMPLATE = "import {{name}} from '../packages/{{package}}/index.js';"
var INSTALL_COMPONENT_TEMPLATE = '  {{name}}'
var MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */
{{include}}
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
{{install}},
   CollapseTransition
];

const install = function(app, opts = {}) {
  // locale.use(opts.locale);
  // locale.i18n(opts.i18n);

  components.forEach(component => {
    app.component(component.name, component);
  });

  app.use(InfiniteScroll);
  app.use(Loading.directive);

  app.config.globalProperties.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  app.config.globalProperties.$loading = Loading.service;
  // app.config.globalProperties.$msgbox = MessageBox;
  // app.config.globalProperties.$alert = MessageBox.alert;
  // app.config.globalProperties.$confirm = MessageBox.confirm;
  // app.config.globalProperties.$prompt = MessageBox.prompt;

   app.config.globalProperties.$notify = Notification;
   app.config.globalProperties.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '{{version}}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
{{list}}
};
`

delete Components.font

var ComponentNames = Object.keys(Components)

var includeComponentTemplate = []
var installTemplate = []
var listTemplate = []

ComponentNames.forEach((name) => {
  if (
    [
      'infinite-scroll',
      'loading',
      'image',
      'card',
      'alert',
      'scrollbar',
      'backtop',
      'popover',
      'button',
      'button-group',
      'calendar',
      'link',
      'dialog',
      'icon',
      'tooltip',
      'transition',
      'col',
      'row',
      'container',
      'header',
      'footer',
      'main',
      'aside',
      'radio-group',
      'radio-button',
      'radio',
      'checkbox-group',
      'checkbox-button',
      'checkbox',
      'switch',
      'badge',
      'avatar',
      'tag',
      'input',
      'alert',
      'carousel',
      'breadcrumb',
      'breadcrumb-item',
      'dialog',
      'upload',
      'rate',
      'divider',
      'progress',
      'collapse',
      'collapse-item',
      'form',
      'form-item',
      'message',
      'pagination',
      'notification',
      'page-header',
      'timeline',
      'timeline-item',
      'input-number',
      'step',
      'steps',
      'popconfirm',
      'drawer',
      'transfer',
      'select',
      'option',
      'option-group',
      'dropdown',
      'dropdown-item',
      'dropdown-menu'
    ].indexOf(name) > -1
  ) {
    // 白名单 挨个替换
    var componentName = uppercamelcase(name)

    includeComponentTemplate.push(
      render(IMPORT_TEMPLATE, {
        name: componentName,
        package: name
      })
    )

    if (
      [
        'Loading',
        'MessageBox',
        'Notification',
        'Message',
        'InfiniteScroll'
      ].indexOf(componentName) === -1
    ) {
      installTemplate.push(
        render(INSTALL_COMPONENT_TEMPLATE, {
          name: componentName,
          component: name
        })
      )
    }

    listTemplate.push(`  ${componentName}`)
  } else {
  }
})

var template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
})

fs.writeFileSync(OUTPUT_PATH, template)
console.log('[build entry] DONE:', OUTPUT_PATH)
