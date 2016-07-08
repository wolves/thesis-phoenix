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

AddButton.propTypes = {};

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

AttributionText.propTypes = {};

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

CancelButton.propTypes = {};

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

DeleteButton.propTypes = {};

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

EditButton.propTypes = {};

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

SaveButton.propTypes = {};

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

SettingsButton.propTypes = {};

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
            this.props.title
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
              this.props.cta
            )
          )
        )
      );
    }
  }]);

  return SettingsTray;
}(_react2.default.Component);

SettingsTray.propTypes = {};

exports.default = SettingsTray;

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

var _mediumEditor = require('medium-editor');

var _mediumEditor2 = _interopRequireDefault(_mediumEditor);

var _net = require('./utilities/net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// https://github.com/yabwe/medium-editor#toolbar-options
var mediumEditorOptions = {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'quote', 'orderedlist', 'unorderedlist', 'removeFormat', 'justifyLeft', 'justifyCenter', 'justifyRight'],
    static: true,
    align: 'center',
    sticky: true,
    updateOnEmptySelection: true
  }
};

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
    _this.editor = null;

    // Rebind context
    _this.trayCanceled = _this.trayCanceled.bind(_this);
    _this.traySubmitted = _this.traySubmitted.bind(_this);
    _this.cancelPressed = _this.cancelPressed.bind(_this);
    _this.savePressed = _this.savePressed.bind(_this);
    _this.editPressed = _this.editPressed.bind(_this);
    _this.addPagePressed = _this.addPagePressed.bind(_this);
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
      this.setState({ trayOpen: false });
    }
  }, {
    key: 'traySubmitted',
    value: function traySubmitted(page) {
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

      var body = document.querySelector('body');

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
      this.setState({ editing: false, pageModified: false });
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
  }, {
    key: 'addPagePressed',
    value: function addPagePressed() {
      this.setState({ trayOpen: !this.state.trayOpen, trayType: 'add-page' });
    }
  }, {
    key: 'pageSettingsPressed',
    value: function pageSettingsPressed() {
      this.setState({ trayOpen: !this.state.trayOpen, trayType: 'page-settings' });
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
    key: 'textContentEditors',
    value: function textContentEditors() {
      return document.querySelectorAll('.thesis-content-text');
    }
  }, {
    key: 'htmlContentEditors',
    value: function htmlContentEditors() {
      return document.querySelectorAll('.thesis-content-html');
    }
  }, {
    key: 'allContentEditors',
    value: function allContentEditors() {
      return document.querySelectorAll('.thesis-content');
    }
  }, {
    key: 'subscribeToContentChanges',
    value: function subscribeToContentChanges() {
      var _this4 = this;

      // html editor
      if (this.htmlContentEditors().length > 0) {
        this.editor.subscribe('editableInput', function (event, editable) {
          editable.classList.add('modified');
          _this4.setState({ pageModified: true });
        });
      }

      // TODO: image editor

      // text editor
      var textEditors = this.textContentEditors();
      for (var i = 0; i < textEditors.length; i++) {
        textEditors[i].addEventListener('input', function (e) {
          e.target.classList.add('modified');
          _this4.setState({ pageModified: true });
        }, false);
      }
    }
  }, {
    key: 'addContentEditors',
    value: function addContentEditors() {
      if (!this.editor) {
        this.editor = new _mediumEditor2.default(this.htmlContentEditors(), mediumEditorOptions);
      } else {
        this.editor.setup(); // Rebuild it
      }
      this.toggleTextEditors(true);
      this.subscribeToContentChanges();
    }
  }, {
    key: 'removeContentEditors',
    value: function removeContentEditors() {
      if (!this.editor) {
        return null;
      }
      this.editor.destroy();
      this.editor = null;
      this.toggleTextEditors(false);
    }
  }, {
    key: 'toggleTextEditors',
    value: function toggleTextEditors(editable) {
      var textEditors = this.textContentEditors();
      for (var i = 0; i < textEditors.length; i++) {
        textEditors[i].contentEditable = editable;
      }
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
        var glob = ed.getAttribute('data-thesis-content-global');
        var content = ed.innerHTML;
        contents.push({ name: id, content_type: t, content: content, global: glob });
      }

      return contents;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var el = document.querySelector('body');
      var editors = this.allContentEditors();

      if (this.state.editing) {
        el.classList.add('thesis-editing');
        if (!this.editor) this.addContentEditors();
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
    key: 'renderTrayCta',
    value: function renderTrayCta() {
      var type = this.state.trayType;
      if (type == 'add-page') {
        return 'Save';
      } else if (type == 'page-settings') {
        return 'Update';
      }
    }
  }, {
    key: 'renderTrayTitle',
    value: function renderTrayTitle() {
      var type = this.state.trayType;
      if (type == 'add-page') {
        return 'Add New Page';
      } else if (type == 'page-settings') {
        return 'Page Settings';
      }
    }
  }, {
    key: 'renderTrayClass',
    value: function renderTrayClass() {
      return this.state.trayType;
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
          _react2.default.createElement(_settings_tray2.default, {
            cta: this.renderTrayCta(),
            title: this.renderTrayTitle(),
            path: this.pathname(),
            hasErrors: false,
            pageTitle: this.pageTitle(),
            pageDescription: this.pageDescription(),
            onCancel: this.trayCanceled,
            onSubmit: this.traySubmitted
          }),
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