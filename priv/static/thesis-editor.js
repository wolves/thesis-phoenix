(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("web/static/js/components/add_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddButton = function (_React$Component) {
  _inherits(AddButton, _React$Component);

  function AddButton() {
    _classCallCheck(this, AddButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AddButton).apply(this, arguments));
  }

  _createClass(AddButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { onClick: this.props.onPress, className: "thesis-button add" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          "Add New Page"
        ),
        _react2.default.createElement("i", { className: "fa fa-plus fa-2x" })
      );
    }
  }]);

  return AddButton;
}(_react2.default.Component);

exports.default = AddButton;

});

require.register("web/static/js/components/attribution_text", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttributionText = function (_React$Component) {
  _inherits(AttributionText, _React$Component);

  function AttributionText() {
    _classCallCheck(this, AttributionText);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AttributionText).apply(this, arguments));
  }

  _createClass(AttributionText, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "attribution" },
        _react2.default.createElement(
          "a",
          { href: "//github.com/infinitered/thesis-phoenix", target: "_blank" },
          "Thesis"
        ),
        " is maintained by ",
        _react2.default.createElement(
          "a",
          { href: "//infinite.red", target: "_blank" },
          "Infinite Red"
        )
      );
    }
  }]);

  return AttributionText;
}(_react2.default.Component);

exports.default = AttributionText;

});

require.register("web/static/js/components/cancel_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CancelButton = function (_React$Component) {
  _inherits(CancelButton, _React$Component);

  function CancelButton() {
    _classCallCheck(this, CancelButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CancelButton).apply(this, arguments));
  }

  _createClass(CancelButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { onClick: this.props.onPress, className: "thesis-button cancel" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          "Discard Changes"
        ),
        _react2.default.createElement("i", { className: "fa fa-remove fa-2x" })
      );
    }
  }]);

  return CancelButton;
}(_react2.default.Component);

exports.default = CancelButton;

});

require.register("web/static/js/components/delete_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteButton = function (_React$Component) {
  _inherits(DeleteButton, _React$Component);

  function DeleteButton() {
    _classCallCheck(this, DeleteButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteButton).apply(this, arguments));
  }

  _createClass(DeleteButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "thesis-button delete" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          "Delete This Page"
        ),
        _react2.default.createElement("i", { className: "fa fa-trash fa-2x" })
      );
    }
  }]);

  return DeleteButton;
}(_react2.default.Component);

exports.default = DeleteButton;

});

require.register("web/static/js/components/edit_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditButton = function (_React$Component) {
  _inherits(EditButton, _React$Component);

  function EditButton() {
    _classCallCheck(this, EditButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EditButton).apply(this, arguments));
  }

  _createClass(EditButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { onClick: this.props.onPress, className: "thesis-button edit" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          this.props.text
        ),
        _react2.default.createElement("i", { className: "fa fa-edit fa-2x" })
      );
    }
  }]);

  return EditButton;
}(_react2.default.Component);

exports.default = EditButton;

});

require.register("web/static/js/components/save_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SaveButton = function (_React$Component) {
  _inherits(SaveButton, _React$Component);

  function SaveButton() {
    _classCallCheck(this, SaveButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SaveButton).apply(this, arguments));
  }

  _createClass(SaveButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { onClick: this.props.onPress, className: "thesis-button save" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          "Save Changes"
        ),
        _react2.default.createElement("i", { className: "fa fa-save fa-2x" })
      );
    }
  }]);

  return SaveButton;
}(_react2.default.Component);

exports.default = SaveButton;

});

require.register("web/static/js/components/settings_button", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsButton = function (_React$Component) {
  _inherits(SettingsButton, _React$Component);

  function SettingsButton() {
    _classCallCheck(this, SettingsButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SettingsButton).apply(this, arguments));
  }

  _createClass(SettingsButton, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { onClick: this.props.onPress, className: "thesis-button settings" },
        _react2.default.createElement(
          "div",
          { className: "tooltip" },
          "Page Settings"
        ),
        _react2.default.createElement("i", { className: "fa fa-wrench fa-2x" })
      );
    }
  }]);

  return SettingsButton;
}(_react2.default.Component);

exports.default = SettingsButton;

});

require.register("web/static/js/components/settings_tray", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

var SettingsTray = function (_React$Component) {
  _inherits(SettingsTray, _React$Component);

  function SettingsTray(props) {
    _classCallCheck(this, SettingsTray);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SettingsTray).call(this, props));

    _this.state = {
      title: _this.props.pageTitle,
      description: _this.props.pageDescription,
      isValid: true
    };

    _this.titleChange = _this.titleChange.bind(_this);
    _this.descriptionChange = _this.descriptionChange.bind(_this);
    _this.onSave = _this.onSave.bind(_this);
    return _this;
  }

  _createClass(SettingsTray, [{
    key: "titleChange",
    value: function titleChange(event) {
      this.setState({ title: event.target.value });
    }
  }, {
    key: "descriptionChange",
    value: function descriptionChange(event) {
      this.setState({ description: event.target.value });
    }
  }, {
    key: "onSave",
    value: function onSave() {
      this.props.onSubmit(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "tray-container" },
        _react2.default.createElement(
          "div",
          { className: "tray-wrap" },
          _react2.default.createElement(
            "div",
            { className: "tray-title" },
            "Page Settings"
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "Page Path"
              ),
              _react2.default.createElement("input", { type: "text", value: this.props.path, disabled: true })
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "Page Title"
              ),
              _react2.default.createElement("input", { type: "text", placeholder: "Example Title", value: this.state.title, onChange: this.titleChange })
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "Page Description"
              ),
              _react2.default.createElement("textarea", { placeholder: "Example page description.", value: this.state.description, onChange: this.descriptionChange })
            )
          ),
          _react2.default.createElement("div", { className: "thesis-field-row errors", hidden: this.state.isValid }),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row cta" },
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-cancel", onClick: this.props.onCancel },
              "Cancel"
            ),
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-save", onClick: this.onSave },
              "Apply"
            )
          )
        )
      );
    }
  }]);

  return SettingsTray;
}(_react2.default.Component);

exports.default = SettingsTray;

});

require.register("web/static/js/content_types/html_editor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mediumEditor = require('medium-editor');

var _mediumEditor2 = _interopRequireDefault(_mediumEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlEditor = function () {
  function HtmlEditor(thesis) {
    _classCallCheck(this, HtmlEditor);

    this.thesis = thesis;
    this.editor = null;
    this.editors = document.querySelectorAll('.thesis-content-html');
    this.enabled = false;

    this.changedHtmlEditor = this.changedHtmlEditor.bind(this);
  }

  _createClass(HtmlEditor, [{
    key: 'enable',
    value: function enable() {
      if (this.enabled) return;
      if (!this.editor) {
        this.editor = new _mediumEditor2.default(this.editors, this.mediumEditorOptions());
        this.editor.subscribe('editableInput', this.changedHtmlEditor);
      }
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      if (!this.enabled) return;
      this.editor.destroy();
      this.editor = null;
      this.enabled = false;
    }
  }, {
    key: 'content',
    value: function content(ed) {
      return ed.innerHTML;
    }
  }, {
    key: 'changedHtmlEditor',
    value: function changedHtmlEditor(event, editable) {
      editable.classList.add('modified');

      // TODO: Find a better way to represent that this has been modified
      this.thesis.setState({ pageModified: true });
    }
  }, {
    key: 'mediumEditorOptions',
    value: function mediumEditorOptions() {
      // https://github.com/yabwe/medium-editor#toolbar-options
      return {
        autoLink: true,
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'quote', 'orderedlist', 'unorderedlist', 'removeFormat', 'justifyLeft', 'justifyCenter', 'justifyRight'],
          static: true,
          align: 'center',
          sticky: true,
          updateOnEmptySelection: true
        },
        paste: {
          forcePlainText: false,
          cleanPastedHTML: true,
          cleanAttrs: ['class', 'style', 'dir'],
          cleanTags: ['meta', 'pre']
        }
      };
    }
  }]);

  return HtmlEditor;
}();

exports.default = HtmlEditor;

});

require.register("web/static/js/content_types/image_editor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _image_tray = require('./image_tray');

var _image_tray2 = _interopRequireDefault(_image_tray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageEditor = function () {
  function ImageEditor(thesis) {
    _classCallCheck(this, ImageEditor);

    this.thesis = thesis;
    this.editors = document.querySelectorAll('.thesis-content-image, .thesis-content-background_image');
    this.enabled = false;
    this.clicked = this.clicked.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  _createClass(ImageEditor, [{
    key: 'enable',
    value: function enable() {
      if (this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        this.editors[i].addEventListener('click', this.clicked, false);
      }
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      if (!this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        this.editors[i].removeEventListener('click', this.clicked, false);
      }
      this.enabled = false;
    }
  }, {
    key: 'clicked',
    value: function clicked(e) {
      var id = e.currentTarget.getAttribute('data-thesis-content-id');
      var type = e.currentTarget.getAttribute('data-thesis-content-type');
      var meta = JSON.parse(e.currentTarget.getAttribute('data-thesis-content-meta'));
      var url = '';

      if (type === 'image') {
        url = e.currentTarget.querySelector('img').getAttribute('src');
      } else if (type === 'background_image') {
        url = this.getUrlFromStyle(e.currentTarget.style.backgroundImage);
      }

      // TODO: Find a better way
      this.thesis.setState({
        pageModified: true,
        trayOpen: true,
        trayType: 'image-url',
        trayData: { contentId: id, url: url, alt: meta.alt }
      });
    }
  }, {
    key: 'tray',
    value: function tray(trayData) {
      return _react2.default.createElement(_image_tray2.default, {
        data: trayData,
        onCancel: this.thesis.trayCanceled,
        onSubmit: this.onSubmit });
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(data) {
      var editor = document.querySelector('[data-thesis-content-id="' + data.contentId + '"');
      editor.classList.add('modified');

      var meta = JSON.stringify({ alt: data.alt });
      editor.setAttribute('data-thesis-content-meta', meta);

      var type = editor.getAttribute('data-thesis-content-type');
      if (type === 'image') {
        var img = editor.querySelector('img');
        img.src = data.url;
        img.alt = data.alt;
      } else if (type === 'background_image') {
        editor.style.backgroundImage = 'url("' + data.url + '")';
      }

      // TODO: better way to close tray
      this.thesis.setState({ trayOpen: false, pageModified: true, trayData: null });
    }
  }, {
    key: 'getContent',
    value: function getContent(ed) {
      var type = ed.getAttribute('data-thesis-content-type');
      if (type === 'image') {
        return ed.querySelector('img').getAttribute('src');
      } else {
        return this.getUrlFromStyle(ed.style.backgroundImage);
      }
    }
  }, {
    key: 'getUrlFromStyle',
    value: function getUrlFromStyle(style) {
      return style.replace('url("', '').replace('")', '');
    }
  }]);

  return ImageEditor;
}();

exports.default = ImageEditor;

});

require.register("web/static/js/content_types/image_tray", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

var ImageTray = function (_React$Component) {
  _inherits(ImageTray, _React$Component);

  function ImageTray(props) {
    _classCallCheck(this, ImageTray);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageTray).call(this, props));

    _this.state = {
      contentId: _this.props.data.contentId,
      url: _this.props.data.url,
      alt: _this.props.data.alt,
      isValid: true
    };

    _this.urlChange = _this.urlChange.bind(_this);
    _this.altChange = _this.altChange.bind(_this);
    _this.onSave = _this.onSave.bind(_this);
    return _this;
  }

  _createClass(ImageTray, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data !== null) {
        this.setState({
          contentId: nextProps.data.contentId,
          url: nextProps.data.url,
          alt: nextProps.data.alt,
          isValid: true
        });
      }
    }
  }, {
    key: "urlChange",
    value: function urlChange(event) {
      this.setState({ url: event.target.value });
    }
  }, {
    key: "altChange",
    value: function altChange(event) {
      this.setState({ alt: event.target.value });
    }
  }, {
    key: "onSave",
    value: function onSave() {
      this.props.onSubmit(this.state);
    }
  }, {
    key: "previewImageStyle",
    value: function previewImageStyle() {
      return { backgroundImage: "url(" + this.state.url + ")" };
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "tray-container" },
        _react2.default.createElement(
          "div",
          { className: "tray-wrap" },
          _react2.default.createElement(
            "div",
            { className: "tray-title" },
            "Image URL"
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement("div", { className: "tray-image-preview", style: this.previewImageStyle() })
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "Image URL"
              ),
              _react2.default.createElement("input", { type: "text", placeholder: "http://placekitten.com/200/300", value: this.state.url, onChange: this.urlChange })
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "Alt Text"
              ),
              _react2.default.createElement("input", { type: "text", placeholder: "Describe the image", value: this.state.alt, onChange: this.altChange })
            )
          ),
          _react2.default.createElement("div", { className: "thesis-field-row errors", hidden: this.state.isValid }),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row cta" },
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-cancel", onClick: this.props.onCancel },
              "Cancel"
            ),
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-save", onClick: this.onSave },
              "Apply"
            )
          )
        )
      );
    }
  }]);

  return ImageTray;
}(_react2.default.Component);

exports.default = ImageTray;

});

require.register("web/static/js/content_types/raw_html_editor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _raw_html_tray = require('./raw_html_tray');

var _raw_html_tray2 = _interopRequireDefault(_raw_html_tray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RawHtmlEditor = function () {
  function RawHtmlEditor(thesis) {
    _classCallCheck(this, RawHtmlEditor);

    this.thesis = thesis;
    this.editors = document.querySelectorAll('.thesis-content-raw_html');
    this.clicked = this.clicked.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.enabled = false;
  }

  _createClass(RawHtmlEditor, [{
    key: 'enable',
    value: function enable() {
      if (this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        this.editors[i].addEventListener('click', this.clicked, false);
      }
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      if (!this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        this.editors[i].removeEventListener('click', this.clicked, false);
      }
      this.enabled = false;
    }
  }, {
    key: 'content',
    value: function content(ed) {
      return ed.innerHTML;
    }
  }, {
    key: 'clicked',
    value: function clicked(e) {
      var id = e.currentTarget.getAttribute('data-thesis-content-id');
      var content = e.currentTarget.innerHTML.trim();

      // TODO: Not very happy about how this reaches back into the Thesis editor
      // to set its state. Refactor in the future.
      this.thesis.setState({
        pageModified: true,
        trayOpen: true,
        trayType: 'raw-html',
        trayData: { contentId: id, content: content }
      });
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(data) {
      var editor = document.querySelector('[data-thesis-content-id="' + data.contentId + '"');
      editor.classList.add('modified');
      editor.innerHTML = data.content;

      // TODO: Not very happy about how this reaches back into the Thesis editor
      // to set its state. Refactor in the future.
      this.thesis.setState({ trayOpen: false, pageModified: true });
    }
  }, {
    key: 'tray',
    value: function tray(data) {
      return _react2.default.createElement(_raw_html_tray2.default, {
        data: data,
        onCancel: this.thesis.trayCanceled,
        onSubmit: this.onSubmit });
    }
  }]);

  return RawHtmlEditor;
}();

exports.default = RawHtmlEditor;

});

require.register("web/static/js/content_types/raw_html_tray", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

var RawHtmlTray = function (_React$Component) {
  _inherits(RawHtmlTray, _React$Component);

  function RawHtmlTray(props) {
    _classCallCheck(this, RawHtmlTray);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RawHtmlTray).call(this, props));

    _this.state = {
      contentId: _this.props.data.contentId,
      content: _this.props.data.content,
      isValid: true
    };

    _this.contentChange = _this.contentChange.bind(_this);
    _this.onSave = _this.onSave.bind(_this);
    return _this;
  }

  _createClass(RawHtmlTray, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data !== null) {
        this.setState({
          contentId: nextProps.data.contentId,
          content: nextProps.data.content.trim(),
          isValid: true
        });
      }
    }
  }, {
    key: "contentChange",
    value: function contentChange(event) {
      this.setState({ content: event.target.value });
    }
  }, {
    key: "onSave",
    value: function onSave() {
      this.props.onSubmit(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "tray-container" },
        _react2.default.createElement(
          "div",
          { className: "tray-wrap" },
          _react2.default.createElement(
            "div",
            { className: "tray-title" },
            "Raw HTML"
          ),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row" },
            _react2.default.createElement(
              "label",
              null,
              _react2.default.createElement(
                "span",
                null,
                "HTML code"
              ),
              _react2.default.createElement("textarea", { placeholder: "<h1>Any HTML you like</h1>", value: this.state.content, onChange: this.contentChange })
            )
          ),
          _react2.default.createElement("div", { className: "thesis-field-row errors", hidden: this.state.isValid }),
          _react2.default.createElement(
            "div",
            { className: "thesis-field-row cta" },
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-cancel", onClick: this.props.onCancel },
              "Cancel"
            ),
            _react2.default.createElement(
              "button",
              { className: "thesis-tray-save", onClick: this.onSave },
              "Apply"
            )
          )
        )
      );
    }
  }]);

  return RawHtmlTray;
}(_react2.default.Component);

exports.default = RawHtmlTray;

});

require.register("web/static/js/content_types/text_editor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextEditor = function () {
  function TextEditor(thesis) {
    _classCallCheck(this, TextEditor);

    this.thesis = thesis;
    this.editors = document.querySelectorAll('.thesis-content-text');
    this.enabled = false;

    this.changed = this.changed.bind(this);
  }

  _createClass(TextEditor, [{
    key: 'enable',
    value: function enable() {
      if (this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        var ed = this.editors[i];
        ed.contentEditable = true;
        ed.addEventListener('input', this.changed, false);
        ed.addEventListener('keydown', this.changed, false);
      }
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      if (!this.enabled) return;
      for (var i = 0; i < this.editors.length; i++) {
        var ed = this.editors[i];
        ed.contentEditable = false;
        ed.removeEventListener('input', this.changed, false);
        ed.removeEventListener('keydown', this.changed, false);
      }
      this.enabled = false;
    }
  }, {
    key: 'content',
    value: function content(ed) {
      return ed.textContent;
    }
  }, {
    key: 'changed',
    value: function changed(e) {
      e.currentTarget.classList.add('modified');
      if (e.keyCode === 13) e.preventDefault();

      // TODO: Change this
      this.thesis.setState({ pageModified: true });
    }
  }]);

  return TextEditor;
}();

exports.default = TextEditor;

});

require.register("web/static/js/thesis-editor", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _add_button = require('./components/add_button');

var _add_button2 = _interopRequireDefault(_add_button);

var _delete_button = require('./components/delete_button');

var _delete_button2 = _interopRequireDefault(_delete_button);

var _settings_button = require('./components/settings_button');

var _settings_button2 = _interopRequireDefault(_settings_button);

var _cancel_button = require('./components/cancel_button');

var _cancel_button2 = _interopRequireDefault(_cancel_button);

var _save_button = require('./components/save_button');

var _save_button2 = _interopRequireDefault(_save_button);

var _edit_button = require('./components/edit_button');

var _edit_button2 = _interopRequireDefault(_edit_button);

var _settings_tray = require('./components/settings_tray');

var _settings_tray2 = _interopRequireDefault(_settings_tray);

var _attribution_text = require('./components/attribution_text');

var _attribution_text2 = _interopRequireDefault(_attribution_text);

var _net = require('./utilities/net');

var _net2 = _interopRequireDefault(_net);

var _html_editor = require('./content_types/html_editor');

var _html_editor2 = _interopRequireDefault(_html_editor);

var _raw_html_editor = require('./content_types/raw_html_editor');

var _raw_html_editor2 = _interopRequireDefault(_raw_html_editor);

var _image_editor = require('./content_types/image_editor');

var _image_editor2 = _interopRequireDefault(_image_editor);

var _text_editor = require('./content_types/text_editor');

var _text_editor2 = _interopRequireDefault(_text_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Content types


var ThesisEditor = function (_React$Component) {
  _inherits(ThesisEditor, _React$Component);

  function ThesisEditor(props) {
    _classCallCheck(this, ThesisEditor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ThesisEditor).call(this, props));

    _this.state = {
      editing: false,
      pageModified: false,
      pageToolsHidden: true,
      trayOpen: false,
      trayType: null
    };
    _this.htmlEditor = new _html_editor2.default(_this);
    _this.rawHtmlEditor = new _raw_html_editor2.default(_this);
    _this.imageEditor = new _image_editor2.default(_this);
    _this.textEditor = new _text_editor2.default(_this);

    // Rebind context
    _this.trayCanceled = _this.trayCanceled.bind(_this);
    _this.settingsTraySubmitted = _this.settingsTraySubmitted.bind(_this);
    _this.cancelPressed = _this.cancelPressed.bind(_this);
    _this.savePressed = _this.savePressed.bind(_this);
    _this.editPressed = _this.editPressed.bind(_this);
    // this.addPagePressed = this.addPagePressed.bind(this)
    _this.pageSettingsPressed = _this.pageSettingsPressed.bind(_this);
    return _this;
  }

  _createClass(ThesisEditor, [{
    key: 'pathname',
    value: function pathname() {
      return window.location.pathname;
    }
  }, {
    key: 'pageTitle',
    value: function pageTitle() {
      return document.title;
    }
  }, {
    key: 'pageDescription',
    value: function pageDescription() {
      var desc = this.descriptionMetaTag();
      return desc ? desc.content : null;
    }
  }, {
    key: 'descriptionMetaTag',
    value: function descriptionMetaTag() {
      return document.querySelectorAll('meta[name=description]')[0];
    }
  }, {
    key: 'trayCanceled',
    value: function trayCanceled() {
      this.setState({ trayOpen: false, trayData: null });
    }
  }, {
    key: 'settingsTraySubmitted',
    value: function settingsTraySubmitted(page) {
      document.title = page.title;

      var desc = this.descriptionMetaTag();
      if (desc) {
        desc.content = page.description;
      }

      this.setState({ trayOpen: false, pageModified: true });
    }
  }, {
    key: 'editPressed',
    value: function editPressed() {
      var _this2 = this;

      if (this.state.editing) {
        if (this.state.pageModified) {
          this.cancelPressed();
        } else {
          this.setState({ editing: false, pageModified: false, trayOpen: false });
          setTimeout(function () {
            return _this2.setState({ pageToolsHidden: true });
          }, 800);
        }
      } else {
        this.setState({ editing: true, pageToolsHidden: false, trayOpen: false });
      }
    }
  }, {
    key: 'savePressed',
    value: function savePressed() {
      var _this3 = this;

      var page = { slug: this.pathname(), title: this.pageTitle(), description: this.pageDescription() };
      var contents = this.contentEditorContents();
      this.postToServer(page, contents);
      this.setState({ editing: false, pageModified: false, trayOpen: false });
      setTimeout(function () {
        return _this3.setState({ pageToolsHidden: true });
      }, 800);
    }
  }, {
    key: 'cancelPressed',
    value: function cancelPressed() {
      if (window.confirm('Discard changes and reload the page?')) {
        this.setState({ editing: false });
        window.location.reload();
      }
    }

    // addPagePressed () {
    //   this.setState({trayOpen: !this.state.trayOpen, trayType: 'add-page'})
    // }

  }, {
    key: 'pageSettingsPressed',
    value: function pageSettingsPressed() {
      if (this.state.trayOpen && this.state.trayType !== 'page-settings') {
        this.setState({ trayType: 'page-settings' });
      } else {
        this.setState({ trayOpen: !this.state.trayOpen, trayType: 'page-settings' });
      }
    }
  }, {
    key: 'postToServer',
    value: function postToServer(page, contents) {
      _net2.default.put('/thesis/update', { page: page, contents: contents }).then(function (resp) {
        console.log('SUCCESS');
        console.log(resp);
      }).catch(function (err) {
        console.log('ERROR');
        console.log(err);
      });
    }
  }, {
    key: 'allContentEditors',
    value: function allContentEditors() {
      return document.querySelectorAll('.thesis-content');
    }
  }, {
    key: 'addContentEditors',
    value: function addContentEditors() {
      this.htmlEditor.enable();
      this.rawHtmlEditor.enable();
      this.imageEditor.enable();
      this.textEditor.enable();
    }
  }, {
    key: 'removeContentEditors',
    value: function removeContentEditors() {
      this.htmlEditor.disable();
      this.rawHtmlEditor.disable();
      this.imageEditor.disable();
      this.textEditor.disable();
    }
  }, {
    key: 'contentEditorContents',
    value: function contentEditorContents() {
      var contents = [];

      var editors = this.allContentEditors();
      for (var i = 0; i < editors.length; i++) {
        var ed = editors[i];
        var id = ed.getAttribute('data-thesis-content-id');
        var t = ed.getAttribute('data-thesis-content-type');
        var meta = ed.getAttribute('data-thesis-content-meta');

        var content = this.getContent(t, ed);
        var glob = ed.getAttribute('data-thesis-content-global');
        contents.push({ name: id, content_type: t, content: content, meta: meta, global: glob });
      }

      return contents;
    }
  }, {
    key: 'getContent',
    value: function getContent(t, ed) {
      if (t === 'image' || t === 'background_image') {
        return this.imageEditor.getContent(ed);
      } else if (t === 'text') {
        return this.textEditor.content(ed);
      } else if (t === 'html') {
        return this.htmlEditor.content(ed);
      } else if (t === 'raw_html') {
        return this.rawHtmlEditor.content(ed);
      } else {
        return ed.innerHTML;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var el = document.querySelector('body');
      var editors = this.allContentEditors();

      if (this.state.editing) {
        el.classList.add('thesis-editing');
        this.addContentEditors();
      } else {
        el.classList.remove('thesis-editing');
        this.removeContentEditors();
      }

      if (this.state.pageModified) {
        el.classList.add('thesis-page-modified');
      } else {
        el.classList.remove('thesis-page-modified');
        for (var i = 0; i < editors.length; i++) {
          editors[i].classList.remove('modified');
        }
      }

      if (this.state.trayOpen) {
        el.classList.add('thesis-tray-open');
      } else {
        el.classList.remove('thesis-tray-open');
      }
    }
  }, {
    key: 'renderEditorClass',
    value: function renderEditorClass() {
      var classes = '';
      classes += this.state.editing ? ' active ' : '';
      classes += this.state.pageToolsHidden ? ' thesis-page-tools-hidden ' : '';
      return classes;
    }
  }, {
    key: 'renderEditButtonText',
    value: function renderEditButtonText() {
      return this.state.editing ? 'Editing Page' : 'Edit Page';
    }
  }, {
    key: 'renderFaderClass',
    value: function renderFaderClass() {
      return this.renderEditorClass();
    }
  }, {
    key: 'renderTrayClass',
    value: function renderTrayClass() {
      return this.state.trayType;
    }
  }, {
    key: 'renderTray',
    value: function renderTray() {
      if (this.state.trayType == 'page-settings') {
        return _react2.default.createElement(_settings_tray2.default, {
          path: this.pathname(),
          hasErrors: false,
          pageTitle: this.pageTitle(),
          pageDescription: this.pageDescription(),
          onCancel: this.trayCanceled,
          onSubmit: this.settingsTraySubmitted });
      } else if (this.state.trayType == "image-url") {
        return this.imageEditor.tray(this.state.trayData);
      } else if (this.state.trayType == "raw-html") {
        return this.rawHtmlEditor.tray(this.state.trayData);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'thesis' },
        _react2.default.createElement(
          'div',
          { id: 'thesis-editor', className: this.renderEditorClass() },
          _react2.default.createElement(_save_button2.default, { onPress: this.savePressed }),
          _react2.default.createElement(_settings_button2.default, { onPress: this.pageSettingsPressed }),
          _react2.default.createElement(_cancel_button2.default, { onPress: this.cancelPressed }),
          _react2.default.createElement(_edit_button2.default, { onPress: this.editPressed, text: this.renderEditButtonText() })
        ),
        _react2.default.createElement('div', { id: 'thesis-fader', className: this.renderFaderClass() }),
        _react2.default.createElement(
          'div',
          { id: 'thesis-tray', className: this.renderTrayClass() },
          this.renderTray(),
          _react2.default.createElement(_attribution_text2.default, null)
        )
      );
    }
  }]);

  return ThesisEditor;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(ThesisEditor, null), document.querySelector('#thesis-container'));

});

require.register("web/static/js/utilities/net", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('whatwg-fetch');

// Polyfill for fetch

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

/*
  Usage:

    Net.post('/thesis/something', {my: "body"})
      .then((response) => { console.log(response) })
      .catch((error) => { console.log(error) })
*/
var Net = {
  get: function get(path, body) {
    return Net.request(path, body, 'GET');
  },
  post: function post(path, body) {
    return Net.request(path, body, 'POST');
  },
  put: function put(path, body) {
    return Net.request(path, body, 'PUT');
  },
  patch: function patch(path, body) {
    return Net.request(path, body, 'PATCH');
  },
  delete: function _delete(path, body) {
    return Net.request(path, body, 'DELETE');
  },
  request: function request(path, body, method) {
    return window.fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: new window.Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(body)
    }).then(checkStatus).then(parseJSON);
  }
};

exports.default = Net;

});

require('web/static/js/thesis-editor');