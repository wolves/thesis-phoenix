use Mix.Config

config :thesis, store: Thesis.EctoStore
config :thesis, Thesis.EctoStore, repo: MyApp.Repo

import_config "#{Mix.env}.exs"
