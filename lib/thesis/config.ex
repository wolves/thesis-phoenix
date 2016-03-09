defmodule Thesis.Config do
  @moduledoc false

  def auth do
    Application.get_env(:thesis, :authorization)
  end

  def store do
    Application.get_env(:thesis, :store)
  end

  def repo do
    Application.get_env(:thesis, Thesis.EctoStore)[:repo]
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
