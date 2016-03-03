defmodule Thesis.Mixfile do
  use Mix.Project

  def project do
    [
      app: :thesis,
      version: "0.0.1",
      elixir: "~> 1.2",
      description: description,
      build_embedded: Mix.env == :prod,
      start_permanent: Mix.env == :prod,
      deps: deps
    ]
  end

  def application do
    [applications: [:logger, :phoenix, :phoenix_html, :plug]]
  end

  defp deps do
    [
      phoenix: ">= 0.0.0",
      phoenix_html: ">= 0.0.0",
      ecto: ">= 0.0.0",
      plug: "~> 1.0",
      html_sanitize_ex: "~> 0.1.0"
    ]
  end

  defp description do
    """
    Thesis is a lightweight bolt-on content editing system
    for Phoenix websites.
    """
  end
end
