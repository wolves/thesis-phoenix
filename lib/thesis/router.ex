defmodule Thesis.Router do
  use Phoenix.Router
  alias Thesis.ApiController

  get "/", Api.Controller, :index

  get "/thesis-editor.js", Controller, :js
end
