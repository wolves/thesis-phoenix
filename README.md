# Thesis

Thesis is an Elixir/Phoenix hex package for quickly and easily adding content
editing to any page.

It's inspired by the [Rails gem](https://github.com/infinitered/thesis-rails) by
the same name and author.



## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed as:

  1. Add thesis to your list of dependencies in `mix.exs`:

        def deps do
          [{:thesis, "~> 0.0.1"}]
        end

  2. Ensure thesis is started before your application:

        def application do
          [applications: [:thesis]]
        end

