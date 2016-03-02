defmodule Thesis.Config do
  def auth do
    Application.get_env(:thesis, :authorization)
  end

  def store do
    Application.get_env(:thesis, :store)
  end

  def repo do
    Application.get_env(:thesis, Thesis.Store)[:repo]
  end

  def react_js_source_path do
    Path.join(Application.app_dir(:thesis), "priv/static/react.js")
  end

  def thesis_js_source_path do
    Path.join(Application.app_dir(:thesis), "priv/static/thesis-editor.js")
  end
end
