defmodule Thesis.Mixfile do
  use Mix.Project
  @version "0.0.10" # REMEMBER TO UPDATE package.json and README.md

  def project do
    [
      app: :thesis,
      version: @version,
      elixir: "~> 1.2",
      description: description,
      build_embedded: Mix.env == :prod,
      start_permanent: Mix.env == :prod,
      deps: deps,
      package: package
    ]
  end

  def application do
    [applications: [:logger, :phoenix, :phoenix_html, :plug]]
  end

  defp deps do
    [
      {:phoenix, ">= 0.0.0"},
      {:phoenix_html, ">= 0.0.0"},
      {:ecto, ">= 0.0.0"},
      {:plug, "~> 1.0"},
      {:html_sanitize_ex, "~> 0.1.0"},
      {:ex_doc, ">= 0.0.0", only: [:dev]},
      {:earmark, ">= 0.0.0", only: [:dev]},
      {:dialyze, ">= 0.0.0", only: [:test, :dev]}
    ]
  end

  defp description do
    """
    Thesis is a lightweight bolt-on content editing system
    for Phoenix websites.
    """
  end

  defp package do
    [
      files: ["lib", "priv", "web", "mix.exs", "README*", "LICENSE*", "package.json"],
      licenses: ["MIT"],
      maintainers: ["Jamon Holmgren", "Ken Miller", "Daniel Berkompas"],
      links: %{
        "GitHub" => "https://github.com/infinite_red/thesis",
        "Docs" => "https://hexdocs.pm/thesis/#{@version}/api-reference.html",
        # "Tutorials" => "https://infinite.red/thesis/" # TODO
      }
    ]
  end
end
