defmodule Thesis.Controller do
  @moduledoc """
  Provides a plug that preloads any Thesis content for a page.
  Typically, you'll add this to your `web/web.ex` file, under the `controller`
  function:

      def controller do
        quote do
          use Phoenix.Controller
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

      def render_dynamic_page(conn, view, opts \\ []) do
        templates = view.__templates__
        page = conn.assigns[:thesis_page]
        if page && page.id do
          template =  if page.template in templates do
                        page.template
                      else
                        opts[:default]
                      end
          conn
          |> put_view(view)
          |> put_status(200)
          |> render(template)
        else
          render_404(conn)
        end
      end

      def render_404(nil), do: nil
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
