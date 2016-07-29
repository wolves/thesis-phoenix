use Mix.Config

config :thesis,
  store: Thesis.DummyStore,
  authorization: Thesis.DummyAuth

config :thesis, Thesis.DummyStore, repo: Thesis.DummyRepo

config :thesis, :dynamic_pages,
  view: Thesis.TestView,
  templates: ["index.html"],
  not_found_view: Thesis.TestView,
  not_found_template: "404.html"

