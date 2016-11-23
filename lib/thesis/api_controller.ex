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

  def upload_file(conn, %{"file" => ""}), do: json conn, %{path: ""}
  def upload_file(conn, %{"file" => file}) do
    path = uploader.upload(file)
    json conn, %{path: path}
  end
  def upload_file(conn, _), do: json conn, %{path: ""}

  def show_file(conn, %{"slug" => slug}) do
    file = store.file(slug)
    do_show_file(conn, file)
  end

  defp do_show_file(conn, nil) do
    conn
    |> put_resp_content_type("text/plain; charset=UTF-8")
    |> send_resp(404, "File Not Found")
  end

  defp do_show_file(conn, file) do
    conn
    |> put_resp_content_type(file.content_type)
    |> send_resp(200, file.binary)
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
