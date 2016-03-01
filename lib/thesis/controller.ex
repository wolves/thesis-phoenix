defmodule Thesis.Controller do
  use Phoenix.Controller
  import Thesis.Config
  alias Thesis.Page

  def index(conn, _params) do
    json conn, %{pages: store.get_pages}
  end
end
