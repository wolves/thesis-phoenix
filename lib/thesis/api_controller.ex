defmodule Thesis.ApiController do
  use Phoenix.Controller
  import Thesis.Config

  plug :ensure_authorized!

  def index(conn, _params) do
    json conn, %{pages: {}}
  end

  def js(conn, _params) do
    text conn, File.read!(thesis_js_source_path)
  end

  def update(conn, %{"contents" => contents, "page" => page} = params) do
    store.update(page, contents)
    json conn, %{}
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
