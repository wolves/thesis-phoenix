defmodule Thesis.Router do
  use Phoenix.Router
  alias Thesis.Controller

  get "/", Controller, :index

  get "/thesis-editor.js", Controller, :js
end
