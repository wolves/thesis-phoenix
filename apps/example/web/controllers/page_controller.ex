defmodule Example.PageController do
  use Example.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def about(conn, _params) do
    render conn, "about.html"
  end

  def dynamic(conn, _params) do
    render conn, "dynamic.html"
  end
end
