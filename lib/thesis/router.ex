defmodule Thesis.Router do
  defmacro __using__(_) do
    # Reserved for future use
    quote do
      use Phoenix.Router

      pipeline :thesis_pipeline do
        plug Plug.Static, at: "/thesis", from: :thesis, gzip: true,
          cache_control_for_etags: "public, max-age=86400",
          headers: [{"access-control-allow-origin", "*"}]

        plug :fetch_session
        plug :fetch_flash
        plug :put_secure_browser_headers
        plug :allow_all_origins
      end

      scope "/thesis", Thesis do
        pipe_through :thesis_pipeline

        get "/thesis-editor.js", ApiController, :assets

        put "/update", ApiController, :update
      end
    end
  end
end
