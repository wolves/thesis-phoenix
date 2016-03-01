
(function() {
  var Thesis;

  Thesis = {
    setup: function() {
      this.edit_mode = false;
      if (this.requirements() && this.page_is_editable()) {
        this.draw_editor();
        return this.set_up_bindings();
      }
    },
    requirements: function() {
      if (jQuery.ui) {
        return true;
      } else {
        alert("jQuery UI not included. Thesis will not work properly without it.");
        return false;
      }
    },
    edit_mode: function() {
      return this.edit_mode;
    },
    thesis: function() {
      return this.thesis = $("#thesis-editor");
    },
    page_is_editable: function() {
      return this.thesis().length > 0;
    },
    page_in_edit_mode: function() {
      return $("body").hasClass("thesis-editing");
    },
    page_has_unsaved_content: function() {
      return $("body .thesis-content.isModified").length;
    },
    modal: function(blur, type) {
      if (blur == null) {
        blur = false;
      }
      if (type == null) {
        type = "settings";
      }
      this.close_modal();
      if (blur) {
        $("body").addClass("thesis-blur");
      }
      $("body").append(this[type + "_modal_markup"]());
      $("#thesis-modal").fadeIn(300);
      $("#thesis-modal").on("click", ".modal-field.cancel", function(e) {
        e.preventDefault();
        return Thesis.close_modal();
      });
      return $("#thesis-modal").on("submit", "form", function(e) {
        alert("To Do: submit form");
        e.preventDefault();
        return false;
      });
    },
    close_modal: function() {
      if ($("#thesis-modal").length) {
        $("body").removeClass("thesis-blur");
        return $("#thesis-modal").remove();
      }
    },
    settings_modal_markup: function() {
      var is_win;
      is_win = navigator.appVersion.indexOf("Win") !== -1;
      return "<div id=\"thesis-modal\" class=\"settings " + (is_win ? 'windows' : '') + "\">\n  <div class=\"modal-icon\"><i class=\"fa fa-wrench fa-2x\"></i></div>\n  <div class=\"modal-title\">Page Settings</div>\n  <form action=\"\" method=\"\">\n    <label class=\"modal-field\"><span>Page Name</span><input class=\"page-settings_page-title\" name=\"page-settings_page-title\" type=\"text\" /></label>\n    <label class=\"modal-field\"><span>Page Slug</span><input class=\"page-settings_page-slug\" name=\"page-settings_page-slug\" type=\"text\" /></label>\n    <label class=\"modal-field\"><span>Meta Title</span><input class=\"page-settings_meta-title\" name=\"page-settings_meta-title\" type=\"text\" /></label>\n    <label class=\"modal-field\"><span>Meta Description</span><textarea class=\"page-settings_meta-description\" name=\"page-settings_meta-description\"></textarea></label>\n    <label class=\"modal-field cancel\"><button class=\"page-settings_submit\" name=\"page-settings_submit\"><i class=\"fa fa-remove fa-2x\"></i> <span>Cancel</span></button></label>\n    <label class=\"modal-field submit\"><button class=\"page-settings_submit\" name=\"page-settings_submit\" type=\"Submit\" value=\"\"><i class=\"fa fa-save fa-2x\"></i> <span>Save</span></button></label>\n  </form>\n</div>";
    },
    set_up_bindings: function() {
      var t;
      t = this;
      t.thesis.on("mouseenter", function() {
        clearTimeout(this.hide_editor_delay);
        return $(this).addClass("active");
      }).on("mouseleave", function() {
        return this.hide_editor_delay = Utilities.delay(2000, (function(_this) {
          return function() {
            return $(_this).removeClass("active");
          };
        })(this));
      });
      this.edit_page_button.on("mouseenter", function() {
        return t.change_edit_tooltip_status();
      });
      return this.edit_page_button.on("click", function(e) {
        e.preventDefault();
        return t.edit_button_click_actions();
      });
    },
    edit_button_click_actions: function() {
      if (this.page_in_edit_mode()) {
        if (this.page_has_unsaved_content()) {
          return this.change_edit_tooltip_status("Save Page before Exiting", "error");
        } else {
          return this.end_editing();
        }
      } else {
        return this.start_editing();
      }
    },
    change_edit_tooltip_status: function(edit_text, classes) {
      var $tooltip;
      if (edit_text == null) {
        edit_text = null;
      }
      if (classes == null) {
        classes = null;
      }
      $tooltip = this.edit_page_button.find(".tooltip");
      $tooltip.removeClass().addClass("tooltip");
      if (classes) {
        $tooltip.addClass("" + classes);
      }
      if (!edit_text) {
        if (this.page_in_edit_mode()) {
          if (this.page_has_unsaved_content()) {
            edit_text = "Editing Page";
          } else {
            edit_text = "Exit Edit Mode";
          }
        } else {
          edit_text = "Edit Page";
        }
      }
      return $tooltip.text(edit_text);
    },
    start_editing: function() {
      $("body").append($("<div></div>").addClass("thesis-fader"));
      $("body").addClass("thesis-editing");
      $(".thesis-content-html").hallo(this.hallo_html_options());
      $(".thesis-content-text").hallo(this.hallo_text_options());
      return this.change_edit_tooltip_status();
    },
    end_editing: function() {
      $(".thesis-fader").remove();
      $("body").removeClass("thesis-editing");
      $(".thesis-content-html").hallo({
        editable: false
      });
      $(".thesis-content-text").hallo({
        editable: false
      });
      return this.change_edit_tooltip_status();
    },
    save_content: function() {
      var payload;
      payload = {};
      $(".thesis-content-html, .thesis-content-text").each(function() {
        var content_area, content_id;
        content_area = $(this);
        content_id = content_area.data("thesis-content-id");
        return payload[content_id] = content_area.html();
      });
      return $.ajax({
        url: "/thesis/update_page_content",
        data: payload,
        type: "put",
        dataType: "json",
        success: function() {
          return alert("Page saved.");
        },
        error: function() {
          return alert("Sorry, couldn't save this page.");
        }
      });
    },
    add_page: function() {
      var page_name, parent_slug;
      page_name = prompt("What is the name of the new page?");
      if (page_name) {
        parent_slug = null;
        if (confirm("Make this a subpage of the current page?")) {
          parent_slug = window.location.pathname;
        }
        return $.ajax({
          url: "/thesis/create_page",
          data: {
            name: page_name,
            parent_slug: parent_slug
          },
          type: "post",
          dataType: "json",
          success: function(resp, status, xhr) {
            if (resp && resp.page) {
              return window.location = resp.page.slug;
            } else {
              return alert("Unknown error");
            }
          },
          error: function() {
            return alert("Sorry, couldn't save this page.");
          }
        });
      }
    },
    delete_page: function() {
      var really_sure;
      really_sure = confirm("Are you sure you want to delete this page? There is no undo!");
      if (really_sure) {
        return $.ajax({
          url: "/thesis/delete_page",
          data: {
            slug: window.location.pathname
          },
          type: "delete",
          success: function() {
            return alert("Page was deleted.");
          },
          error: function() {
            return alert("Sorry, couldn't delete this page.");
          }
        });
      }
    },
    hallo_text_options: function() {
      var options;
      return options = {
        editable: true
      };
    },
    hallo_html_options: function() {
      var options;
      return options = {
        editable: true,
        plugins: {
          'halloformat': {},
          'halloheadings': {},
          'hallojustify': {},
          'hallolists': {},
          'halloreundo': {},
          'hallolink': {}
        }
      };
    },
    draw_editor: function() {
      this.thesis.append(this.draw_add_icon());
      this.thesis.append(this.draw_delete_icon());
      this.thesis.append(this.draw_settings_icon());
      this.thesis.append(this.draw_cancel_icon());
      this.thesis.append(this.draw_save_icon());
      this.thesis.append(this.draw_edit_icon());
      return this.edit_page_button = this.thesis.find(".thesis-button.edit");
    },
    draw_edit_icon: function() {
      var $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-edit fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Edit Page");
      return $("<div></div>").addClass("thesis-button edit").append($tooltip, $icon);
    },
    draw_save_icon: function() {
      var $button, $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-save fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Save Changes");
      $button = $("<div></div>").addClass("thesis-button save").append($tooltip, $icon);
      return $button.on("click", function() {
        Thesis.save_content();
        return Thesis.end_editing();
      });
    },
    draw_add_icon: function() {
      var $button, $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-plus fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Add New Page");
      $button = $("<div></div>").addClass("thesis-button add").append($tooltip, $icon);
      return $button.on("click", function() {
        return Thesis.add_page();
      });
    },
    draw_settings_icon: function() {
      var $button, $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-wrench fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Page Settings");
      $button = $("<div></div>").addClass("thesis-button settings").append($tooltip, $icon);
      return $button.on("click", function() {
        return Thesis.modal(true, "settings");
      });
    },
    draw_delete_icon: function() {
      var $button, $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-trash fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Delete Page");
      $button = $("<div></div>").addClass("thesis-button delete").append($tooltip, $icon);
      return $button.on("click", function() {
        return Thesis.delete_page();
      });
    },
    draw_cancel_icon: function() {
      var $button, $icon, $tooltip;
      $icon = $("<i></i>").addClass("fa fa-remove fa-2x");
      $tooltip = $("<div></div>").addClass("tooltip").text("Discard Changes");
      $button = $("<div></div>").addClass("thesis-button cancel").append($tooltip, $icon);
      return $button.on("click", function() {
        Thesis.end_editing();
        return location.reload();
      });
    }
  };

  jQuery(function($) {
    return Thesis.setup();
  });

}).call(this);

