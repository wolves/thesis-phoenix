defmodule Thesis.Controller do
  @moduledoc """
  Provides a plug that preloads any Thesis content for a page.
  Typically, you'll add this to your `web/web.ex` file, under the `controller`
  function:

      def controller do
        quote do
          use Thesis.Controller
          # ...
        end
      end

  If you'd prefer to only use Thesis in certain controllers, remove it from
  `web/web.ex` and add it to the specific controllers by doing this:

      defmodule MyApp.MyController do
        use Thesis.Controller
        # ...
  """

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
    current_page = store.page(conn.request_path)
    page_contents = store.page_contents(current_page)

    conn
    |> assign(:thesis_page, current_page)
    |> assign(:thesis_content, page_contents)
  end
end
