# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :example,
  ecto_repos: [Example.Repo]

# Configures the endpoint
config :example, Example.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "5L91v3ZYDH3RS2+UuBDQSyjSlTNqJ1g5umEcLzKsM9MziK8PGwuvtMO03hC1p6e5",
  render_errors: [view: Example.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Example.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure thesis content editor
config :thesis,
  store: Thesis.EctoStore,
  authorization: Example.ThesisAuth,
  uploader: Thesis.RepoUploader

# config :thesis, Thesis.OspryUploader,
#   ospry_public_key: System.get_env("OSPRY_PUBLIC_KEY")

config :thesis, Thesis.EctoStore, repo: Example.Repo

# If you want to allow creating dynamic pages:
config :thesis, :dynamic_pages,
  view: Example.PageView,
  templates: ["dynamic.html"],
  not_found_view: Example.ErrorView,
  not_found_template: "404.html"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
