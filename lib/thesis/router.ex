defmodule Thesis.Router do
  @moduledoc """
  Creates the routes that Thesis uses to handle requests from its javascript
  editor client as well as static assets.

  Typically, you'll add this to your `web/web.ex` file, under the `router`
  function:

      def router do
        quote do
          use Phoenix.Router
          use Thesis.Router
          # ...
        end
      end

  If you'd prefer, you can remove it from `web/web.ex` and add it to the router
  yourself:

      defmodule MyApp.Router do
        use Thesis.Router
        # ...
  """

  defmacro __using__(_) do
    # Reserved for future use
    quote do
      pipeline :thesis_pipeline do
        plug Plug.Static, at: "/thesis", from: :thesis, gzip: true,
          cache_control_for_etags: "public, max-age=86400",
          headers: [{"access-control-allow-origin", "*"}]

        plug :fetch_session
        plug :fetch_flash
        plug :put_secure_browser_headers
      end

      scope "/thesis", Thesis do
        pipe_through :thesis_pipeline

        get "/thesis-editor.js", ApiController, :assets

        put "/update", ApiController, :update
      end
    end
  end
end
