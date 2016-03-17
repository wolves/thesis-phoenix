use Mix.Config

config :thesis,
  store: Thesis.DummyStore,
  authorization: Thesis.DummyAuth

config :thesis, Thesis.DummyStore, repo: Thesis.DummyRepo

