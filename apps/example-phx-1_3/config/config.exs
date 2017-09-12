# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :example_phx,
  ecto_repos: [ExamplePhx.Repo]

# Configures the endpoint
config :example_phx, ExamplePhxWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "mOs3MKJVPN4vBI53teBwWNqhE13lBDY+XlQh2AXcJw0O1WzKXuHqTdFM6SmTB2nP",
  render_errors: [view: ExamplePhxWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ExamplePhx.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure thesis content editor
config :thesis,
  store: Thesis.EctoStore,
  authorization: ExamplePhx.ThesisAuth,
  uploader: Thesis.RepoUploader
  #  uploader: <MyApp>.<CustomUploaderModule>
  #  uploader: Thesis.OspryUploader
config :thesis, Thesis.EctoStore, repo: ExamplePhx.Repo
# config :thesis, Thesis.OspryUploader,
#   ospry_public_key: "pk-prod-asdfasdfasdfasdf"
# If you want to allow creating dynamic pages:
# config :thesis, :dynamic_pages,
#   view: ExamplePhx.PageView,
#   templates: ["index.html", "otherview.html"],
#   not_found_view: ExamplePhx.ErrorView,
#   not_found_template: "404.html"
