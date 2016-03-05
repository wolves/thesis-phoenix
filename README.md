# Thesis

Thesis is an Elixir/Phoenix hex package for quickly and easily adding content
editing to any page.

It's inspired by the [Rails gem](https://github.com/infinitered/thesis-rails) by
the same name and author.

![2016-03-05-enu58](https://cloud.githubusercontent.com/assets/1479215/13549778/137ec256-e2c2-11e5-8c6e-7cd653cbd52b.gif)

## Installation and Configuration

1. Add thesis to your `mix.exs`:

```elixir
def deps do
  [{:thesis, "~> 0.0.1"}]
end

def application do
  [applications: [:thesis]]
end
```

2. Run `mix thesis.install`

This will add Thesis to your `package.json`, `config.exs`, generate
a migration, and generate an authorization module.

## Making Pages Editable

TODO

## Authorization

TODO

