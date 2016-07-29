defmodule Thesis.Config do
  @moduledoc false

  def auth do
    Application.get_env(:thesis, :authorization)
  end

  def store do
    Application.get_env(:thesis, :store)
  end

  def dynamic_pages do
    Application.get_env(:thesis, :dynamic_pages)
  end

  def dynamic_view do
    dynamic_pages[:view]
  end

  def dynamic_templates do
    dynamic_pages[:templates] || []
  end

  def dynamic_not_found_view do
    dynamic_pages[:not_found_view]
  end

  def dynamic_not_found_template do
    dynamic_pages[:not_found_template] || "404.html"
  end

  def repo do
    Application.get_env(:thesis, Thesis.EctoStore)[:repo]
  end

  def ospry_public_key do
    Application.get_env(:thesis, Thesis.OspryUploader)[:ospry_public_key]
  end

  def thesis_js_source_path do
    Path.join(Application.app_dir(:thesis), "priv/static/thesis-editor.js")
  end

  def controller_missing_text do
    """
      Content missing for this page. Does your controller need to use Thesis.Controller?
      Add the following to web/web.ex:
        def controller do
          quote do
            # ...

            use Thesis.Controller
          end
        end
    """
  end
end
