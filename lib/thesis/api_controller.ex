defmodule Thesis.ApiController do
  use Phoenix.Controller
  import Thesis.Config
  alias Thesis.Page

  plug :ensure_authorized!

  def index(conn, _params) do
    json conn, %{pages: {}}
  end

  def js(conn, params) do
    text conn, File.read!(thesis_js_source_path)
  end

  def update(conn, %{page: page, contents: contents}) do
    store.update(page, contents)
  end

  defp ensure_authorized!(conn, _params) do
    if auth.page_is_editable?(conn) do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> halt
    end
  end
end
