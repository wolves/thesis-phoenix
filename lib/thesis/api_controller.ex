defmodule Thesis.ApiController do
  @moduledoc false

  use Phoenix.Controller
  import Thesis.Config

  plug :ensure_authorized!

  def assets(conn, _params), do: conn

  def update(conn, %{"contents" => contents, "page" => page}) do
    :ok = store.update(page, contents)
    json conn, %{}
  end

  def delete(conn, %{"path" => path}) do
    :ok = store.delete(%{"slug" => path})
    json conn, %{}
  end

  defp ensure_authorized!(conn, _params) do
    if auth.page_is_editable?(conn), do: conn, else: put_unauthorized(conn)
  end

  defp put_unauthorized(conn) do
    conn
    |> put_status(:unauthorized)
    |> halt
  end
end
