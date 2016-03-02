defmodule Thesis.Controller do
  use Phoenix.Controller
  import Thesis.Config
  alias Thesis.Page

  plug :ensure_authorized!

  def index(conn, _params) do
    json conn, %{pages: {}}
  end

  def js(conn, params) do
    text conn, load_react(params["react"]) <> File.read!(thesis_js_source_path)
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

  # TODO: Put these somewhere else?
  defp load_react("true"), do: File.read!(react_js_source_path)
  defp load_react(_), do: ""
end
