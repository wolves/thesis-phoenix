defmodule Thesis.Controller do

  defmacro __using__(_) do
    quote do
      plug Thesis.Controller.Plug
    end
  end

end

defmodule Thesis.Controller.Plug do

  import Plug.Conn, only: [assign: 3]
  import Thesis.Config

  def init(_) do
  end

  def call(conn, _opts) do
    conn |> Plug.Conn.assign(:thesis_content, store.page_contents(conn.request_path))
  end
end
