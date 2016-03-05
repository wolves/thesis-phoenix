defmodule Thesis.Router do
  defmacro __using__(_) do
    # Reserved for future use
    quote do
      use Phoenix.Router

      pipeline :thesis_assets do
        plug Plug.Static, at: "/thesis", from: :thesis, gzip: true,
          cache_control_for_etags: "public, max-age=86400",
          headers: [{"access-control-allow-origin", "*"}]
      end

      scope "/thesis", Thesis do
        pipe_through :thesis_assets

        get "/thesis-editor.js", ApiController, :assets
        put "/update", ApiController, :update
      end
    end
  end
end
