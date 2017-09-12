defmodule ExamplePhxWeb.PageController do
  use ExamplePhxWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def login(conn, _params) do
    conn
    |> ExamplePhx.Authentication.login()
    |> redirect(to: "/")
  end

  def logout(conn, _params) do
    conn
    |> ExamplePhx.Authentication.logout()
    |> redirect(to: "/")
  end

  def dynamic(conn, _params) do
    render_dynamic(conn)
  end
end
